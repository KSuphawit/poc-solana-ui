import React, { useEffect, useState } from "react";
import { BN, web3 } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  PHANTOM_WALLET_URL,
  TWITTER_HANDLE,
  TWITTER_LINK,
} from "constants/link";
import twitterLogo from "assets/twitter-logo.svg";
import "styles/App.css";
import { TokenAddress } from "constants/TokenAddress";
import {
  getConnection,
  getProgram,
  getProvider,
  PROGRAM_ID,
} from "utils/utils";

const App = (props) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const { PublicKey } = web3;
  const cluster = props.cluster;
  const connection = getConnection(cluster);

  useEffect(() => {
    const onLoad = async () => {
      await isPhantomConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const isPhantomConnected = async () => {
    try {
      const { solana } = window;

      if (!solana || !solana.isPhantom) return;

      const response = await solana.connect({ onlyIfTrusted: true });
      setWalletAddress(response.publicKey.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (!solana) window.open(PHANTOM_WALLET_URL);

    const response = await solana.connect();

    setWalletAddress(response.publicKey.toString());
  };

  const onSubmit = async () => {
    if (inputValue.length <= 0) {
      alert("Please enter your amount.");
      return;
    }

    setInputValue("");

    await callRpcMintToken();
  };

  const callRpcMintToken = async () => {
    try {
      const provider = getProvider(cluster);
      const program = getProgram(cluster);
      const [_, bumpSeed] = await PublicKey.findProgramAddress([], PROGRAM_ID);

      const token = new Token(
        connection,
        TokenAddress.DRT,
        TOKEN_PROGRAM_ID,
        provider.wallet.publicKey
      );

      const mintInfo = await token.getMintInfo();

      const associatedTokenAccount =
        await token.getOrCreateAssociatedAccountInfo(mintInfo.mintAuthority);

      await program.rpc.mintToken(new BN(+inputValue), bumpSeed, {
        accounts: {
          token: token.publicKey,
          tokenAuthority: mintInfo.mintAuthority,
          destination: associatedTokenAccount.address,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      });
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
        Connect Phantom Wallet
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
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
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
