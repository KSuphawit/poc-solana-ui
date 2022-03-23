import './UserStatus.css'
import CountUp from "react-countup";

export const UserStatus = (props) => {

    const shortWalletAddress = (walletAddress) => {
        return `${walletAddress.slice(0, 4)}...${walletAddress.slice(walletAddress.length-4)}`
    }

    return (
        <div className="user-status-container">
            <h4>Your Status ({shortWalletAddress(props.walletAddress)})</h4>
            <h3>
                <CountUp
                    start={props.userDepositStart}
                    end={props.userDepositEnd}
                    prefix="$ "
                    separator=","
                    decimals={2}
                />
            </h3>
        </div>
    )

}


export default UserStatus