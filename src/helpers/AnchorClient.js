import {BN, Program, Provider, web3} from "@project-serum/anchor";
import idl from "idl/idl.json";
import PhantomWalletAdaptor from "./PhantomWalletAdaptor";
import {MAIN_STATE_SEED, METADATA_SEED} from "../constants/Seed";
import {parseReserve} from "@solendprotocol/solend-sdk";
import {ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID} from "@solana/spl-token";

const opts = {
    preflightCommitment: "processed",
};


export default class AnchorClient {

    constructor(cluster) {
        this.programId = new web3.PublicKey(idl.metadata.address)
        this.connection = new web3.Connection(web3.clusterApiUrl(cluster), opts.preflightCommitment)
        this.wallet = PhantomWalletAdaptor.isPhantomExist() ? window.solana : PhantomWalletAdaptor.getPhantomWallet()
        this.provider = new Provider(this.connection, this.wallet, opts.preflightCommitment)
        this.program = new Program(idl, this.programId, this.provider)
    }

    async getMainStateAccount() {
        const [mainStatePDA] = await web3.PublicKey.findProgramAddress([Buffer.from(MAIN_STATE_SEED)], this.programId)
        const mainState = await this.program.account.mainState.fetch(mainStatePDA)
        return [mainStatePDA, mainState]
    }

    async getTotalDeposit() {
        const [, mainState] = await this.getMainStateAccount()
        const [, metadata] = await this.getMetadataAccount()
        const mintInfo = await this.getMintInfo(metadata.usdcMint)

        return mainState.totalDeposit / Math.pow(10, mintInfo.decimals)
    }

    async getMetadataAccount() {
        const [metadataPDA] = await web3.PublicKey.findProgramAddress([Buffer.from(METADATA_SEED)], this.programId)
        const metadata = await this.program.account.metadata.fetch(metadataPDA)
        return [metadataPDA, metadata]
    }

    async getUserDepositAccount(userPubKey) {
        const [userDepositReferencePDA] = await web3.PublicKey.findProgramAddress([userPubKey.toBuffer()], this.programId)
        let userDepositReference = await this.program.account.userDepositReference.fetchNullable(userDepositReferencePDA)

        if (!userDepositReference) {
            await this.depositInitialize(userPubKey)
            userDepositReference = await this.program.account.userDepositReference.fetch(userDepositReferencePDA)
        }

        const [userDepositPDA] = await web3.PublicKey.findProgramAddress([Buffer.from(new BN(userDepositReference.slot).toArray("le", 8))], this.programId)
        const userDeposit = await this.program.account.userDeposit.fetch(userDepositPDA)

        return [userDepositPDA, userDeposit]
    }

    async depositInitialize(userPubKey) {
        const [mainStatePDA, mainState] = await this.getMainStateAccount()
        const newSlot = new BN(mainState.currentSlot).add(1)
        const [userDepositReference] = web3.PublicKey.findProgramAddress([userPubKey.toBuffer()], this.programId)
        const [userDepositPDA] = await web3.PublicKey.findProgramAddress([Buffer.from(newSlot.toArray("le", 8))], this.programId)

        await this.program.rpc.depositInitialize({
            accounts: {
                userDeposit: userDepositPDA,
                userDepositReference: userDepositReference,
                mainState: mainStatePDA,
                depositor: this.provider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            },
        });
    }

    async getReserve(reservePubKey) {
        const reserveAccountInfo = await this.connection.getAccountInfo(reservePubKey)
        const reserve = parseReserve(reservePubKey, reserveAccountInfo)
        return reserve.info
    }

    async getMintInfo(mintPubKey) {
        const token = new Token(this.connection, mintPubKey, TOKEN_PROGRAM_ID, this.provider.wallet.publicKey)
        return token.getMintInfo()
    }

    async getAssociatedTokenAddress(mintPubKey) {
        return Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mintPubKey, this.provider.wallet.publicKey)
    }

    async getTransactionInvolvedData() {
        const [mainStatePDA] = await this.getMainStateAccount()
        const [metadataPDA, metadata] = await this.getMetadataAccount()
        const [lendingMarketAuthority] = await web3.PublicKey.findProgramAddress([metadata.lendingMarketAuthoritySeed.toBuffer()], metadata.lendingProgram)
        const [userDepositPDA] = await this.getUserDepositAccount(this.provider.wallet.publicKey)
        const userTokenAccount = await this.getAssociatedTokenAddress(metadata.usdcMint)
        const reserve = await this.getReserve(metadata.reserve)
        const usdcMintInfo = await this.getMintInfo(metadata.usdcMint)

        return {
            mainStatePDA,
            metadataPDA,
            metadata,
            lendingMarketAuthority,
            userDepositPDA,
            userTokenAccount,
            reserve,
            usdcMintInfo
        }

    }

    async deposit(amount) {
        const transactionInvolvedData = await this.getTransactionInvolvedData()

        const tx = await this.program.rpc.deposit(
            {
                uiAmount: amount,
                decimals: transactionInvolvedData.usdcMintInfo.decimals
            },
            {
                accounts: {
                    userDeposit: transactionInvolvedData.userDepositPDA,
                    mainState: transactionInvolvedData.mainStatePDA,
                    metadata: transactionInvolvedData.metadataPDA,
                    programAuthority: transactionInvolvedData.metadata.programAuthority,
                    usdcMint: transactionInvolvedData.metadata.usdcMint,
                    programUsdcTokenAccount: transactionInvolvedData.metadata.usdcTokenAccount,
                    userUsdcTokenAccount: transactionInvolvedData.userTokenAccount,
                    collateral: transactionInvolvedData.metadata.collateral,
                    reserve: transactionInvolvedData.metadata.reserve,
                    reserveLiquiditySupply: transactionInvolvedData.reserve.liquidity.supplyPubkey,
                    reserveCollateralMint: transactionInvolvedData.reserve.collateral.mintPubkey,
                    lendingMarket: transactionInvolvedData.reserve.lendingMarket,
                    lendingMarketAuthority: transactionInvolvedData.lendingMarketAuthority,
                    destinationDepositCollateral: transactionInvolvedData.reserve.collateral.supplyPubkey,
                    obligation: transactionInvolvedData.metadata.obligation,
                    reserveLiquidityPythOracle: transactionInvolvedData.reserve.liquidity.pythOracle,
                    lendingProgram: transactionInvolvedData.metadata.lendingProgram,
                    reserveLiquiditySwitchboardOracle: transactionInvolvedData.reserve.liquidity.switchboardOracle,
                    owner: this.provider.wallet.publicKey,
                    clock: web3.SYSVAR_CLOCK_PUBKEY,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
            })

        console.log(`Deposit transaction signature : ${tx} , program token account : ${transactionInvolvedData.metadata.usdcTokenAccount}`)
    }

    async withdraw(amount) {
        const transactionInvolvedData = await this.getTransactionInvolvedData()

        const tx = await this.program.rpc.withdraw(
            {
                uiAmount: amount,
                decimals: transactionInvolvedData.usdcMintInfo.decimals
            },
            {
                accounts: {
                    userDeposit: transactionInvolvedData.userDepositPDA,
                    mainState: transactionInvolvedData.mainStatePDA,
                    metadata: transactionInvolvedData.metadataPDA,
                    programAuthority: transactionInvolvedData.metadata.programAuthority,
                    usdcMint: transactionInvolvedData.metadata.usdcMint,
                    programUsdcTokenAccount: transactionInvolvedData.metadata.usdcTokenAccount,
                    userUsdcTokenAccount: transactionInvolvedData.userTokenAccount,
                    collateral: transactionInvolvedData.metadata.collateral,
                    reserve: transactionInvolvedData.metadata.reserve,
                    obligation: transactionInvolvedData.metadata.obligation,
                    lendingMarket: transactionInvolvedData.reserve.lendingMarket,
                    lendingMarketAuthority: transactionInvolvedData.lendingMarketAuthority,
                    reserveCollateralMint: transactionInvolvedData.reserve.collateral.mintPubkey,
                    reserveCollateralSupply: transactionInvolvedData.reserve.collateral.supplyPubkey,
                    reserveLiquiditySupply: transactionInvolvedData.reserve.liquidity.supplyPubkey,
                    reserveLiquidityPythOracle: transactionInvolvedData.reserve.liquidity.pythOracle,
                    reserveLiquiditySwitchboardOracle: transactionInvolvedData.reserve.liquidity.switchboardOracle,
                    lendingProgram: transactionInvolvedData.metadata.lendingProgram,
                    owner: this.provider.wallet.publicKey,
                    clock: web3.SYSVAR_CLOCK_PUBKEY,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
            })

        console.log(`Withdraw transaction signature : ${tx} , program token account : ${transactionInvolvedData.metadata.usdcTokenAccount}`)
    }
}