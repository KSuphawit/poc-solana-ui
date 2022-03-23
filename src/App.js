import {useState} from "react";
import ConnectWallet from "components/ConnectWallet/ConnectWallet";
import AnchorClient from "./helpers/AnchorClient";
import CountUp from "react-countup";
import UserStatus from "./components/UserStatus/UserStatus";
import "./styles/App.css";

const App = (props) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [anchorClient, setAnchorClient] = useState(null);
    const [totalDepositStart, setTotalDepositStart] = useState(0);
    const [totalDepositEnd, setTotalDepositEnd] = useState(0);
    const [userDepositStart, setUserDepositStart] = useState(0);
    const [userDepositEnd, setUserDepositEnd] = useState(0);

    const setWallet = async (publicKey) => {
        const anchorClient = new AnchorClient(props.cluster)
        setAnchorClient(anchorClient)
        setWalletAddress(publicKey)

        const totalDeposit = await anchorClient.getTotalDeposit()
        setTotalDepositEnd(totalDeposit)

        const userTotalDeposit = await anchorClient.getUserDepositAmount(publicKey)
        setUserDepositEnd(userTotalDeposit)
    }

    const deposit = async () => {
        setInputValue("");
        setTotalDepositStart(totalDepositEnd)
        setUserDepositStart(userDepositEnd)
        await anchorClient.deposit(inputValue)

        const totalDeposit = await anchorClient.getTotalDeposit()
        setTotalDepositEnd(totalDeposit)

        const userTotalDeposit = await anchorClient.getUserDepositAmount(walletAddress)
        setUserDepositEnd(userTotalDeposit)
    }

    const withdraw = async () => {
        setInputValue("");
        setTotalDepositStart(totalDepositEnd)
        setUserDepositStart(userDepositEnd)
        await anchorClient.withdraw(inputValue)

        const totalDeposit = await anchorClient.getTotalDeposit()
        setTotalDepositEnd(totalDeposit)

        const userTotalDeposit = await anchorClient.getUserDepositAmount(walletAddress)
        setUserDepositEnd(userTotalDeposit)
    }


    const renderConnected = () => (
        <div className="connected-container">
            <p className="sub-text">Pool Balances</p>
            <p className="header gradient-text">
                <CountUp
                    start={totalDepositStart}
                    end={totalDepositEnd}
                    prefix="$ "
                    separator=","
                    decimals={2}
                />
            </p>
            <div className="transaction-container">
                <input
                    type="text"
                    placeholder="Minimum 1 USDC."
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                />
                <button type="submit" onClick={deposit} className="cta-button submit-button">
                    Deposit
                </button>
                <button type="submit" onClick={withdraw} className="cta-button submit-button">
                    Withdraw
                </button>
            </div>
            <UserStatus walletAddress={walletAddress} userDepositStart={userDepositStart} userDepositEnd={userDepositEnd}/>
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
