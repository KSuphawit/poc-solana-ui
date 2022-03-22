import {useState} from "react";
import "styles/App.css";
import ConnectWallet from "components/ConnectWallet/ConnectWallet";
import AnchorClient from "./helpers/AnchorClient";
import CountUp from "react-countup";

const App = (props) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [anchorClient, setAnchorClient] = useState(null);
    const [countUpStart, setCountUpStart] = useState(0);
    const [countUpEnd, setCountUpEnd] = useState(0);

    const setWallet = async (publicKey) => {
        const anchorClient = new AnchorClient(props.cluster)
        setAnchorClient(anchorClient)
        setWalletAddress(publicKey)

        const totalDeposit = await anchorClient.getTotalDeposit()
        setCountUpEnd(totalDeposit)
    }

    const depositToken = async () => {
        setInputValue("");
        setCountUpStart(countUpEnd)
        await anchorClient.deposit(inputValue)

        const totalDeposit = await anchorClient.getTotalDeposit()
        setCountUpEnd(totalDeposit)
    }

    const withdrawToken = async () => {
        setInputValue("");
        await anchorClient.withdraw(inputValue)
    }


    const renderConnected = () => (
        <div className="connected-container">
            <p className="sub-text">Pool Balances</p>
            <p className="header">
                <CountUp
                    start={countUpStart}
                    end={countUpEnd}
                    prefix="$ "
                    separator=","
                    decimals={2}
                />
            </p>
            <input
                type="text"
                className="deposit-input"
                placeholder="Minimum deposit 1 USDC."
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
            />
            <button type="submit" onClick={depositToken} className="cta-button submit-gif-button">
                Deposit Token
            </button>
            {/*<button type="submit" onClick={withdrawToken} className="cta-button submit-gif-button">*/}
            {/*    Withdraw Token*/}
            {/*</button>*/}
        </div>
    );

    return (
        <div className="App">
            <div className={walletAddress ? "authed-container" : "container"}>
                <div className="header-container">
                    {!walletAddress && (
                        <ConnectWallet setWalletAddress={setWallet}/>
                    )}
                    {walletAddress && renderConnected()}
                </div>
            </div>
        </div>
    );
};

export default App;
