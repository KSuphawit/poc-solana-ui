import './UserStatus.css'
import CountUp from "react-countup";

export const UserStatus = (props) => {

    const shortWalletAddress = (walletAddress) => {
        return `${walletAddress.slice(0, 4)}...${walletAddress.slice(walletAddress.length-4)}`
    }

    return (
        <div className="user-status-container">
            <div className="user-status-header">
                <h3>Your Status ({shortWalletAddress(props.walletAddress)})</h3>
            </div>
            <div className="user-status-detail">
                <span className="title">All Deposits</span>
                <div className="user-deposit-amount gradient-text">
                    <h1>
                        <CountUp
                            start={props.userDepositStart}
                            end={props.userDepositEnd}
                            prefix="$ "
                            separator=","
                            decimals={2}
                        />
                    </h1>
                </div>
            </div>
        </div>
    )
}


export default UserStatus