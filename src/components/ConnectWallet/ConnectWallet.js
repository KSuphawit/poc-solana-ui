import {useEffect} from "react";
import PhantomWalletAdaptor from "../../helpers/PhantomWalletAdaptor";

export const ConnectWallet = (props) => {
    useEffect(() => {
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
    }, []);

    const onLoad = async () => {
        const publicKey = await PhantomWalletAdaptor.isPhantomConnected();
        props.setWalletAddress(publicKey)
    };

    const onConnectWallet = async () => {
        const publicKey = await PhantomWalletAdaptor.connectWallet()
        props.setWalletAddress(publicKey);
    };

    return (
        <div>
            <p className="header">LOTTO DEMO</p>
            <p className="sub-text">💲💲💲</p>
            <button
                className="cta-button connect-wallet-button"
                onClick={onConnectWallet}
            >
                Connect Phantom Wallet
            </button>
        </div>
    );
};

export default ConnectWallet;
