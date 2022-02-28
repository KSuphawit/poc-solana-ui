import {useState} from "react";
import "styles/App.css";
import ConnectWallet from "components/ConnectWallet/ConnectWallet";
import {Token} from "./constants/Token";
import AnchorClient from "./helpers/AnchorClient";

const App = (props) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [anchorClient, setAnchorClient] = useState(null);


    const setWallet = (publicKey) => {
        setAnchorClient(new AnchorClient(props.cluster))
        setWalletAddress(publicKey)
    }

    const depositToken = async (e) => {
        e.preventDefault();
        setInputValue("");
        await anchorClient.depositToSolend(Token.USDC, +inputValue)
    }

    const withdrawToken = async (e) => {
        e.preventDefault();
        setInputValue("");
        await anchorClient.withdrawFromSolend(Token.USDC, +inputValue)
    }


    const renderInputAmount = () => (
        <div className="connected-container">
            <input
                type="text"
                placeholder="Enter token amount!"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
            />
            <button type="submit" onClick={depositToken} className="cta-button submit-gif-button">
                Deposit Token
            </button>
            <button type="submit" onClick={withdrawToken} className="cta-button submit-gif-button">
                Withdraw Token
            </button>
        </div>
    );

    return (
        <div className="App">
            <div className={walletAddress ? "authed-container" : "container"}>
                <div className="header-container">
                    <p className="header">Solend Connect</p>
                    <p className="sub-text">🤑🤑🤑</p>
                    {!walletAddress && (
                        <ConnectWallet setWalletAddress={setWallet}/>
                    )}
                    {walletAddress && renderInputAmount()}
                </div>
            </div>
        </div>
    );
};

export default App;
