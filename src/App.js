import { useState } from "react";
import { BN, web3 } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { TWITTER_HANDLE, TWITTER_LINK } from "constants/link";
import twitterLogo from "assets/twitter-logo.svg";
import "styles/App.css";
import { TokenAddress } from "constants/TokenAddress";
import {
  getConnection,
  getProgram,
  getProvider,
  PROGRAM_ID,
} from "shared/utils/utils";
import ConnectWallet from "shared/components/ConnectWallet/ConnectWallet";

const App = (props) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const { PublicKey } = web3;
  const cluster = props.cluster;
  const connection = getConnection(cluster);

  const onSubmit = async (e) => {
    e.preventDefault();

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
        await token.getOrCreateAssociatedAccountInfo(provider.wallet.publicKey);

      const amount = +inputValue * Math.pow(10, mintInfo.decimals);

      await program.rpc.mintToken(new BN(amount), bumpSeed, {
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

  const renderInputAmount = () => (
    <div className="connected-container">
      <form onSubmit={onSubmit}>
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
          {!walletAddress && (
            <ConnectWallet setWalletAddress={setWalletAddress} />
          )}
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
