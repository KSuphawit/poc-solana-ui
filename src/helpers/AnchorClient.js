import * as anchor from "@project-serum/anchor"
import {clusterApiUrl, PublicKey} from "@solana/web3.js";
import idl from "idl/idl.json";
import WalletAdaptorPhantom from "./WalletAdaptorPhantom";
import {SolendDepositInfo} from "../constants/solend/SolendDepositInfo";
import {SolendWithdrawInfo} from "../constants/solend/SolendWithdrawInfo";


const opts = {
    preflightCommitment: "processed",
};


export default class AnchorClient {

    constructor(cluster) {
        this.programId = new PublicKey(idl.metadata.address)
        this.conection = new anchor.web3.Connection(clusterApiUrl(cluster), opts.preflightCommitment)
        this.wallet = WalletAdaptorPhantom.isPhantomExist() ? window.solana : WalletAdaptorPhantom.getPhantomWallet()
        this.provider = new anchor.Provider(this.conection, this.wallet, opts.preflightCommitment)
        this.program = new anchor.Program(idl, this.programId, this.provider)
    }


    async depositToSolend(token, amount) {
        const amountToDeposit = amount * Math.pow(10, token.decimals)
        const depositInfo = SolendDepositInfo[this.provider.wallet.publicKey.toString()]

        try {
            const result = await this.program.rpc.depositReserveLiquidityAndObligationCollateral(
                new anchor.BN(amountToDeposit),
                {
                    accounts: depositInfo
                }
            )
            console.log("AnchorClient.depositToSolend.result : ", result)
        } catch (e) {
            console.log("AnchorClient.depositToSolend.error : ", e)
        }
    }

    async withdrawFromSolend(token, amount) {
        const amountToWithdraw = amount * Math.pow(10, token.decimals)
        const withdrawInfo = SolendWithdrawInfo[this.provider.wallet.publicKey.toString()]

        try {
            const result = await this.program.rpc.withdrawObligationCollateralAndRedeemReserveCollateral(
                new anchor.BN(amountToWithdraw),
                {
                    accounts: withdrawInfo,
                    remainingAccounts: [
                        {pubkey: withdrawInfo.reserve2, isSigner: false, isWritable: false},
                        {pubkey: withdrawInfo.reserve, isSigner: false, isWritable: false},
                        {pubkey: withdrawInfo.reserve, isSigner: false, isWritable: false}
                    ]
                }
            )

            console.log("AnchorClient.withdrawFromSolend.result : ", result)

        } catch (e) {
            console.log("AnchorClient.withdrawFromSolend.error : ", e)
        }
    }
}