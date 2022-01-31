import { useEffect } from "react";
import { PHANTOM_WALLET_URL } from "constants/link";

export const ConnectWallet = (props) => {
  useEffect(() => {
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  });

  const onLoad = async () => {
    await isPhantomConnected();
  };

  const isPhantomConnected = async () => {
    try {
      const { solana } = window;

      if (!solana || !solana.isPhantom) return;

      const response = await solana.connect({ onlyIfTrusted: true });
      props.setWalletAddress(response.publicKey.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (!solana) window.open(PHANTOM_WALLET_URL);

    const response = await solana.connect();

    props.setWalletAddress(response.publicKey.toString());
  };

  return (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect Phantom Wallet
    </button>
  );
};

export default ConnectWallet;
