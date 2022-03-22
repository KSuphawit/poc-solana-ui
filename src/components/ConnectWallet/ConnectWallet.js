import {useEffect} from "react";
import PhantomWalletAdaptor from "../../helpers/PhantomWalletAdaptor";

export const ConnectWallet = (props) => {
    useEffect(() => {
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
    },[]);

    const onLoad = async () => {
        const publicKey = await PhantomWalletAdaptor.isPhantomConnected();
        props.setWalletAddress(publicKey)
    };

    const onConnectWallet = async () => {
        const publicKey = await PhantomWalletAdaptor.connectWallet()
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
