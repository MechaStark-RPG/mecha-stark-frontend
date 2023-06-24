import React, { useEffect, useState } from "react";
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
// import * as fs from 'fs';
import contractJson from './main.json';

declare var MECHA_STARK_WALLET_PRIVKEY : string | undefined;

const GOERLI_URL = 'https://alpha4.starknet.io'
const MECHA_STARK_ADDRESS = '0x03a1db2968737c3b2797accd5f3d6c9daf15c563e4a8de0ad061e88a42043739'

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
      if (decoded) {
        login(decoded.username);
        return setRedirectToReferrer(true);
      }
    };
    if (token) {
      // Trying to connect with token if exists
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
      login(walletAddress);
      setRedirectToReferrer(true);
    } catch (error) {
      console.log(error.message);
      setIsServerDown(true);
    }
  };

  const connectWallet = async() => {   
    try{
        const wallet = await connect({ modalMode: "canAsk", modalTheme: "dark", storeVersion: "chrome" });
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

  return (
    <>
      {redirectToReferrer && (
        <Redirect to={location.state || { from: { pathname: "/" } }} />
      )}
      {isServerDown && (
        <ErrorHandler
          redirectUrl="/"
          error={{
            title: "SEVERS ARE DOWN FOR MAINTAINENCE!",
            content: "WE WILL BE BACK SOON, BIGGER AND BETTER"
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
            title: "LOGIN FAILED, TRY AGAIN!",
            content: "CHECK YOUR CREDENTIALS OR TRY ANOTHER NAME"
          }}
          resetError={() => {
            setIsLoginFailed(false);
          }}
        />
      )}
      <div className="row align-items-center justify-content-left">
        <div className="col-sm-12 col-md-6">
          <IntroInfo />
          
        </div>
      </div>
    </>
  );
}

const IntroInfo = () => {
  return (
    <div>
      <div>Do you want to be a Mecha?</div>
      <div>
        Play MechaStark-RPG with your friends <br />
      </div>
      <div>
        Create or join a room to start <br /> custom draft with your friends{" "}
        <br />
      </div>
    </div>
  );
};
