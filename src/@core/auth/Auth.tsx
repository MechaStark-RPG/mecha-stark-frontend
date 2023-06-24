import React, { useEffect, useState, CSSProperties } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Location } from "history";
import { Form, InputGroup, FormControl, Button } from "react-bootstrap";
import { restUrl } from "../../env";
import useAuth from "./useAuth";
import ErrorHandler from "../ErrorHandler";
import { Contract, Provider, json, ec, Account, number, stark  } from "starknet";
import { connect, disconnect } from "get-starknet";
import contractJson from './main.json';
/** @jsx jsx */
import { jsx, css}  from '@emotion/core';

declare var MECHA_STARK_WALLET_PRIVKEY : string | undefined;

const GOERLI_URL = 'https://alpha4.starknet.io'
const MECHA_STARK_ADDRESS = '0x03a1db2968737c3b2797accd5f3d6c9daf15c563e4a8de0ad061e88a42043739'
// 0x01aaeaf9a95f8b76b42f3e58758b97d96e4843635d2e74672870ddddb8c970bf
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
      console.log('logged with wallet: ', walletAddress)
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
            setWalletProvider(wallet.provider);

            const mechaStarkContract = new Contract(contractJson.abi, MECHA_STARK_ADDRESS, wallet.provider);
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
      const provider = new Provider({ sequencer: { network: "goerli-alpha" } });
      const starkKeyPair = ec.getKeyPair(MECHA_STARK_WALLET_PRIVKEY);
      const accountAddress = "0x053f44e0e4e4ed385e0e1a79f2c10371ca999bd5b04a24600d6f8fc1070647d6";
      const mechaWalletAccount = new Account(provider, accountAddress, starkKeyPair);

      const mechaStarkContractPrivate = new Contract(contractJson.abi, MECHA_STARK_ADDRESS, provider);
      mechaStarkContractPrivate.connect(mechaWalletAccount);

      const result = await mechaStarkContractPrivate.call("name");
      console.log("name private call: ", result.toString());
      } catch(error) {
        console.log("connectMechaStarkWallet: ", error.message);
      }
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
  backgroundImage: "url('./assets/map.png')",
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat',
  opacity: 0.9,
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
