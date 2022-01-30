import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import idl from "./idl.json";

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, clusterApiUrl, Connection, PublicKey } = web3;

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed",
};

// Token Public key
const tokenPublicKey = new PublicKey(
  "CuxuCrT6FCAc5SUoGDoMVuf7UCLwAvzUmseq4a9VBNqw"
);

// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = "Ksuphawit";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const connection = new Connection(network, opts.preflightCommitment);

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect({ onlyIfTrusted: true });
        setWalletAddress(response.publicKey.toString());
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const onInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const getProvider = () => {
    return new Provider(connection, window.solana, opts.preflightCommitment);
  };

  const onSubmit = async () => {
    if (inputValue.length <= 0) {
      alert("Please enter your amount.");
      return;
    }
    setInputValue("");
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const [_, bumpSeed] = await PublicKey.findProgramAddress([], programID);

      const token = new Token(
        connection,
        tokenPublicKey,
        TOKEN_PROGRAM_ID,
        provider.wallet.publicKey
      );

      const mintInfo = await token.getMintInfo();

      const ourAssociatedTokens = await token.getOrCreateAssociatedAccountInfo(
        mintInfo.mintAuthority
      );

      const result = await program.rpc.mintToken(bumpSeed, {
        accounts: {
          token: token.publicKey,
          tokenAuthority: mintInfo.mintAuthority,
          destination: ourAssociatedTokens.address,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      });

      console.log("Result ==> ", result);
    } catch (error) {
      console.log("Error sending :", error);
    }
  };

  const renderNotConnectedContainer = () => {
    return (
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWallet}
      >
        Connect to Wallet
      </button>
    );
  };

  const renderInputAmount = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="text"
          placeholder="Enter token amount!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
    </div>
  );

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">💰💰 Rich Portal</p>
          <p className="sub-text">become rich with us 🤑</p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderInputAmount()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
