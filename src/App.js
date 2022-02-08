import { useState } from "react";
import { BN, web3, utils } from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { TWITTER_HANDLE, TWITTER_LINK } from "constants/link";
import twitterLogo from "assets/twitter-logo.svg";
import "styles/App.css";
import {
  getConnection,
  getProgram,
  getProvider,
  PROGRAM_ID,
} from "shared/utils/utils";
import ConnectWallet from "shared/components/ConnectWallet/ConnectWallet";
import { doc as anchor } from "prettier";
import { Dropdown } from "react-bootstrap";

const App = (props) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } = web3;
  const cluster = props.cluster;
  const dropdownMenus = [
    {
      menu: "Deposit Token",
      onClick: (e) => callRpcDepositToken(e),
    },
    {
      menu: "Withdraw Token",
      onClick: (e) => callRpcWithdrawToken(e),
    },
  ];

  const callRpcDepositToken = async (e) => {
    e.preventDefault();
    setInputValue("");
    try {
      const provider = getProvider(cluster);
      const program = getProgram(cluster);
      const depositToken = new PublicKey(
        "CuxuCrT6FCAc5SUoGDoMVuf7UCLwAvzUmseq4a9VBNqw"
      );
      const [returnToken, returnTokenBump] = await PublicKey.findProgramAddress(
        [new TextEncoder().encode("token")],
        PROGRAM_ID
      );
      const [programAuthority, programAuthorityBump] =
        await PublicKey.findProgramAddress(
          [Buffer.from(utils.bytes.utf8.encode("program_authority"))],
          PROGRAM_ID
        );

      console.log(
        ">>>>>>>>>>>>>>>>>>>>>>> programAuthority : ",
        programAuthority.toString()
      );

      const programDepositTokenAssocTokenAcct = (
        await PublicKey.findProgramAddress(
          [
            programAuthority.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            depositToken.toBuffer(),
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      )[0];

      const userDepositTokenAssocTokenAcct =
        await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          depositToken,
          provider.wallet.publicKey
        );

      const userReturnTokenAssocTokenAcct =
        await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          returnToken,
          provider.wallet.publicKey
        );

      const amount = +inputValue * Math.pow(10, 9);

      const depositTokenResult = await program.rpc.depositToken(
        new BN(amount),
        {
          accounts: {
            depositToken: depositToken,
            returnToken: returnToken,
            programDepositTokenAssocTokenAcct:
              programDepositTokenAssocTokenAcct,
            userDepositTokenAssocTokenAcct: userDepositTokenAssocTokenAcct,
            userReturnTokenAssocTokenAcct: userReturnTokenAssocTokenAcct,
            user: provider.wallet.publicKey,
            programAuthority: programAuthority,
            tokenProgram: TOKEN_PROGRAM_ID,
            // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            // rent: SYSVAR_RENT_PUBKEY,
            // systemProgram: SystemProgram.programId,
          },
        }
      );

      console.log("Result callRpcDepositToken", depositTokenResult);

      // await callRpcMintToken();
    } catch (error) {
      console.log("Error callRpcDepositToken :", error);
    }
  };

  const callRpcWithdrawToken = async (e) => {
    e.preventDefault();
    setInputValue("");
    try {
      const provider = getProvider(cluster);
      const program = getProgram(cluster);
      const withdrawToken = new PublicKey(
        "CuxuCrT6FCAc5SUoGDoMVuf7UCLwAvzUmseq4a9VBNqw"
      );
      const [programAuthority, programAuthorityBump] =
        await PublicKey.findProgramAddress(
          [Buffer.from(utils.bytes.utf8.encode("program_authority"))],
          PROGRAM_ID
        );
      const [burningToken, _] = await PublicKey.findProgramAddress(
        [new TextEncoder().encode("token")],
        PROGRAM_ID
      );

      const programWithdrawTokenAssocTokenAcct = (
        await PublicKey.findProgramAddress(
          [
            programAuthority.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            withdrawToken.toBuffer(),
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      )[0];

      console.log(
        ">>>>>>>>>>>>>>>>>>>>>>>>>>> programWithdrawTokenAssocTokenAcct ",
        programWithdrawTokenAssocTokenAcct.toString()
      );

      const userWithdrawTokenAssocTokenAcct =
        await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          withdrawToken,
          provider.wallet.publicKey
        );

      console.log(
        ">>>>>>>>>>>>>>>>>>>> userWithdrawTokenAssocTokenAcct ",
        userWithdrawTokenAssocTokenAcct.toString()
      );

      const burningSource = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        burningToken,
        provider.wallet.publicKey
      );

      const amount = +inputValue * Math.pow(10, 9);

      const withdrawTokenResult = await program.rpc.withdrawToken(
        new BN(amount),
        {
          accounts: {
            withdrawToken: withdrawToken,
            burningToken: burningToken,
            programWithdrawTokenAssocTokenAcct:
              programWithdrawTokenAssocTokenAcct,
            userWithdrawTokenAssocTokenAcct: userWithdrawTokenAssocTokenAcct,
            burningSource: burningSource,
            user: provider.wallet.publicKey,
            programAuthority: programAuthority,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
        }
      );

      console.log("Result callRpcWithdrawToken", withdrawTokenResult);
    } catch (error) {
      console.log("Error callRpcWithdrawToken :", error);
    }
  };

  const renderInputAmount = () => (
    <div className="connected-container">
      <form onSubmit={callRpcDepositToken}>
        <input
          type="text"
          placeholder="Enter token amount!"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Deposit Token
        </button>
      </form>
      <form onSubmit={callRpcWithdrawToken}>
        <button type="submit" className="cta-button submit-gif-button">
          Withdraw Token
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
