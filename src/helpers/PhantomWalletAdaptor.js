import {PHANTOM_WALLET_URL} from "../constants/Link";

export default class PhantomWalletAdaptor {

    static isPhantomExist = () => {
        const {solana} = window

        return solana && solana.isPhantom;
    }

    static connectWallet = async () => {
        const {solana} = window

        if (!this.isPhantomExist()) this.getPhantomWallet();

        const response = await solana.connect();

        return response.publicKey.toString()
    }

    static getPhantomWallet = () => {
        window.open(PHANTOM_WALLET_URL);
    }

    static isPhantomConnected = async () => {
        const {solana} = window;

        if (!this.isPhantomExist()) return;

        const response = await solana.connect({onlyIfTrusted: true});

        return response.publicKey.toString()
    }



}
