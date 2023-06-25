import React, { useEffect, useState, CSSProperties } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Location } from "history";
import { Form, InputGroup, FormControl, Button } from "react-bootstrap";
import { restUrl } from "../../env";
import useAuth from "./useAuth";
import ErrorHandler from "../ErrorHandler";
import { Contract, Provider, json, ec, Account, constants, stark, uint256, CallData, cairo, Call } from "starknet";
import { connect, disconnect } from "get-starknet";
import contractJson from './main.json';
import MECHA_STARK_ABI from './abi.json';
/** @jsx jsx */
import { jsx, css}  from '@emotion/core';

declare var MECHA_STARK_WALLET_PRIVKEY : string | undefined;
declare var MECHA_STARK_WALLET_ACC_ADDRESS: string | undefined;

const MECHA_STARK_ADDRESS = '0x02FF3acf120d57D8eA2ECD4555D5701C77D4132586391C6e068e8317dE703a07'

const verifyToken = async token => {
  console.log(`${restUrl}/auth/verify`);

  try {
    const response = await axios.post(`${restUrl}/auth/verify`, { token });
    if (response.data.success) {
      return response.data.decoded;
    }
  } catch (error) {
    console.log(`Error al intentar verify with token: ${token}`);
  }

  return undefined;
};

interface AuthProps {
  loggedIn: boolean;
  logIn: boolean;
  location: Location;
}

export default function Auth({ location }: AuthProps) {
  const { login, loggedIn, logout } = useAuth();
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [isServerDown, setIsServerDown] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);  
  const [walletProvider, setWalletProvider] = useState<Provider>();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [isGoerliAccount, setIsGoerliAccount] = useState<boolean>();
  const [mechaStarkContract, setMechaStarkContract] = useState<Contract>();
  
  useEffect(() => {
    if (walletConnected && walletAddress) {
      handleLogin(walletAddress)
    }
  }, [walletConnected, walletAddress]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const tryConnectWallet = async () => {
      return await connectWallet();
    };

    if (loggedIn) {
      return setRedirectToReferrer(true);
    }
    connectMechaStarkWallet();
    
    tryConnectWallet();

    const token = Cookies.get("MSRPG-PROFILE");
    // eslint-disable-next-line consistent-return
    const innerVerifyToken = async () => {
      const decoded = await verifyToken(token);
      if (decoded && walletConnected) {
        login({ walletAddress: decoded.username, walletConnected }); // username == walletAddress
        return setRedirectToReferrer(true);
      }
    };
    if (token) {
      innerVerifyToken();
    }
  }, []);

// eslint-disable-next-line consistent-return
  const handleLogin = async (walletAddress) => {
    try {
      const response = await axios.post(`${restUrl}/auth/login`, {
        username: walletAddress
      });
      if (!response.data.success || !response) {
        return setIsLoginFailed(true);
      }
      // Guardo una cookie con el token
      Cookies.set("MSRPG-PROFILE", response.data.token);
      login({walletConnected, walletAddress});
      setRedirectToReferrer(true);
    } catch (error) {
      console.log(error.message);
      setIsServerDown(true);
    }
  };

  const connectWallet = async() => {   
    try{
        const wallet = await connect({ modalMode: "alwaysAsk", modalTheme: "dark", storeVersion: "chrome" });
        if (wallet) {
            await wallet.enable();
            setWalletConnected(wallet.isConnected);
            setWalletAddress(wallet.selectedAddress);
            setWalletProvider(wallet.account);

            const mechaStarkContract = new Contract(contractJson.abi, MECHA_STARK_ADDRESS, wallet.account);
            setMechaStarkContract(mechaStarkContract);
        } else {
        console.log('PLEASE CONNECT A WALLET');
        }
    }   catch(error){     
        console.log('connectWallet: ', error.message)
    }
  }


  const connectMechaStarkWallet = async() => {   
    try{
      await callValidateGame();
    } catch(error) {
        console.log("connectMechaStarkWallet: ", error.message);
      }
  }

  const getContractAndAccount = async () => {
    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
    // const starkKeyPair = ec.starkCurve.getStarkKey(MECHA_STARK_WALLET_PRIVKEY);
    
    if (MECHA_STARK_WALLET_ACC_ADDRESS === '' || MECHA_STARK_WALLET_PRIVKEY === '') {
      console.log("Warning: envs are not setted?")
      return { mechaStarkContract: undefined, privateAccount: undefined, provider: undefined }
    }
    const privateAccount = new Account(provider, MECHA_STARK_WALLET_ACC_ADDRESS, MECHA_STARK_WALLET_PRIVKEY);

    const mechaStarkContract= new Contract(MECHA_STARK_ABI, MECHA_STARK_ADDRESS, provider);
    mechaStarkContract.connect(privateAccount);

    return { mechaStarkContract, privateAccount, provider }
  }

  const callValidateGame = async () => {
    const { mechaStarkContract, privateAccount, provider } = await getContractAndAccount();
    if (mechaStarkContract === undefined || privateAccount === undefined || provider === undefined) {
      return;
    }
    const validateCallData = getValidateCallData();

    const res: Call = mechaStarkContract.populate("finish_game", {
      game_id: validateCallData.game_id,
      game_state: validateCallData.game_state,
      turns: validateCallData.turns,
    });

    const { transaction_hash: transferTxHash } = await privateAccount.execute(res, undefined, { maxFee: 900_000_000_000_000 });
    console.log(`Sending Finish Game to Starknet...`, transferTxHash);
    await provider.waitForTransaction(transferTxHash);
  }
  
  const getValidateCallData = () => {
    const position_default = {x: 100, y: 100}
    const action_1_player_1 = {
      mecha_id: 1,
      first_action: 0,
      movement: position_default,
      attack: { x: 5, y: 0 },
    };

    const action_2_player_1 = {
      mecha_id: 2,
      first_action: 0,
      movement: position_default,
      attack: { x: 5, y: 1 },
    };
    
    const action_3_player_1 = {
      mecha_id: 3,
      first_action: 0,
      movement: position_default,
      attack: { x: 5, y: 2 },
    };
  
    const action_4_player_1 = {
      mecha_id: 4,
      first_action: 0,
      movement: position_default,
      attack: { x: 5, y: 3 },
    };

    const action_5_player_1 = {
      mecha_id: 5,
      first_action: 0,
      movement: position_default,
      attack: { x: 5, y: 4 },
    };

    const player_1_actions = [action_1_player_1, action_2_player_1, action_3_player_1, action_4_player_1, action_5_player_1];

    const game_id = 1;
    const player_1 = '0x053f44e0e4e4ed385e0e1a79f2c10371ca999bd5b04a24600d6f8fc1070647d6';
    let turn_player_1 = { game_id: game_id, player: player_1, actions: player_1_actions };

    const mecha_state_1_player_1 = { id: 1, hp: 1, position: {x: 2, y: 0} };
    const mecha_state_2_player_1 = {id: 2, hp: 100, position: {x: 2, y: 1} };
    const mecha_state_3_player_1 = {id: 3, hp: 100, position: {x: 2, y: 2} };
    const mecha_state_4_player_1 = {id: 4, hp: 100, position: {x: 2, y: 3} };
    const mecha_state_5_player_1 = {id: 5, hp: 100, position: {x: 2, y: 4} };

    let mechas_player_1 = [mecha_state_1_player_1, mecha_state_2_player_1, mecha_state_3_player_1, mecha_state_4_player_1, mecha_state_5_player_1 ];

    const action_1_player_2 = { mecha_id: 6, first_action: 0, movement: position_default, attack: { x: 2, y: 0 } };
    const action_2_player_2 = { mecha_id: 7, first_action: 0, movement: position_default, attack: { x: 2, y: 1 } };
    const action_3_player_2 = { mecha_id: 8, first_action: 0, movement: position_default, attack: { x: 2, y: 2 } };
    const action_4_player_2 = { mecha_id: 9, first_action: 0, movement: position_default, attack: { x: 2, y: 3 } };
    const action_5_player_2 = { mecha_id: 10, first_action: 0, movement: position_default, attack: { x: 2, y: 4 } };

    const player_2_actions = [action_1_player_2, action_2_player_2, action_3_player_2, action_4_player_2, action_5_player_2];
    const player_2 = '0x0660cC8805f88E40c4e685ABf35B279DC05C02db063f719074A4Fd2c0bfe725a';

    const mecha_state_1_player_2 = {id: 6, hp: 100, position: {x: 5, y: 0} };
    const mecha_state_2_player_2 = {id: 7, hp: 100, position: {x: 5, y: 1} };
    const mecha_state_3_player_2 = {id: 8, hp: 100, position: {x: 5, y: 2} };
    const mecha_state_4_player_2 = {id: 9, hp: 100, position: {x: 5, y: 3} };
    const mecha_state_5_player_2 = {id: 10, hp: 100, position: {x: 5, y: 4} };

    let turn_player_2 = { game_id: game_id, player: player_2, actions: player_2_actions };
    let mechas_player_2 = [mecha_state_1_player_2, mecha_state_2_player_2, mecha_state_3_player_2, mecha_state_4_player_2, mecha_state_5_player_2 ];

    const turns = [turn_player_1, turn_player_2, turn_player_1, turn_player_2, turn_player_1, turn_player_2, turn_player_1, turn_player_2]
    
    const game_state = {
      game_id: game_id, 
      player_1: player_1, 
      player_2: player_2, 
      mechas_state_player_1: mechas_player_1, 
      mechas_state_player_2: mechas_player_2
    }
    console.log(game_state)

    return { game_id: game_id, game_state: game_state, turns: turns };
  }

	const handleDisconnect = async () =>{
		disconnect( { clearLastWallet: true } );
		setWalletAddress(undefined);
    setWalletConnected(false);
    setWalletProvider(undefined);
	}

  return (
    <div style={backgroundDiv}>
      <div style={textBox}>
        <div style={principalText}>
        2D Turn-Based Strategic Game – Connect your Braavos or ArgentX wallet, mint your mechas and tokens for free, and embark on an exciting gaming adventure!
        </div>
        {walletConnected && 
            <button style={flags}
                onClick={() => handleDisconnect()}>Disconnect Wallet</button>
        }
        {!walletConnected && 
           <div style={connectWalletText}>
            <br/>
            Please connect your testnet wallet to start
            <br/>
            <button style={flags}
					    onClick={() => connectWallet() }>
						  Connect Wallet<br />
				      </button>
            </div>
        }
      </div>
      {redirectToReferrer && (
        <Redirect to={location.state || { from: { pathname: "/" } }} />
      )}
      {isServerDown && (
        <ErrorHandler
          redirectUrl="/"
          error={{
            title: "Servers are down for maintainence!",
            content: "We will be back soon, bigger and better"
          }}
          resetError={() => {
            setIsServerDown(false);
          }}
        />
      )}
      {isLoginFailed && (
        <ErrorHandler
          redirectUrl="/"
          error={{
            title: "Login failed, try again!",
            content: "Check your credentials or try another name"
          }}
          resetError={() => {
            setIsLoginFailed(false);
          }}
        />
      )}
    </div>
  );
}

const backgroundDiv: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: -1,
  width: '100%',
  height: '100%',
  backgroundImage: "url('./assets/mechabg.png')",
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat',
  opacity: 1,
};

const textBox: CSSProperties = {
  border: 'solid',
  borderColor: 'rgba(255, 255, 255, 0.5)',
  textAlign: 'center',
  alignSelf: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  padding: '1%',
  marginBottom: '4rem',
  borderRadius: '5px',
  gridTemplateColumns: '1fr',
  maxWidth: '70%',
  margin: 'auto',
  zIndex: 1,
};

const principalText: CSSProperties = {
  fontSize: '50px',
  color: '#ffffff',
  font: 'Roboto',
};

const connectWalletText: CSSProperties = {
  fontSize: '25px',
  color: '#ffffff',
  font: 'Roboto',
};

const flags: CSSProperties = {
  font: 'Roboto',
  textAlign: 'center',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '4px',
  fontSize: '16px',
  color: 'white',
  padding: '12px 20px 12px 20px',
  backgroundSize: '20px 20px',
  backgroundPosition: '10px 10px',
  backgroundRepeat: 'no-repeat',
  backgroundColor: 'rgba(21, 161, 222, 0.9)',
  marginLeft: '1%',
  marginRight: '1%',
  marginBottom: '1%',
  marginTop: '1%',
  overflow: 'hidden',   
}
