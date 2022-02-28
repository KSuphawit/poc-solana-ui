import {useEffect} from "react";
import WalletAdaptorPhantom from "../../helpers/WalletAdaptorPhantom";

export const ConnectWallet = (props) => {
    useEffect(() => {
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
    });

    const onLoad = async () => {
        const publicKey = await WalletAdaptorPhantom.isPhantomConnected();
        props.setWalletAddress(publicKey)
    };

    const onConnectWallet = async () => {
        const publicKey = await WalletAdaptorPhantom.connectWallet()
        props.setWalletAddress(publicKey);
    };

    return (
        <button
            className="cta-button connect-wallet-button"
            onClick={onConnectWallet}
        >
            Connect Phantom Wallet
        </button>
    );
};

export default ConnectWallet;
