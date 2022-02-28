import * as anchor from '@project-serum/anchor';
import {SolendProgramId} from "./Solend";
import {SYSVAR_CLOCK_PUBKEY} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";


export const SolendDepositInfo = {
    "4YPTC5LFiWNjcJjnaKSnZQgXEnGWgDcxwSLdozvCUUqE": {
        poolProgram: SolendProgramId.DEV_NET,
        sourceLiquidity: new anchor.web3.PublicKey("39XieSM6DMrE3sANqGeuASxe1Yw1hKPftSMKCdLm1e6W"),
        userCollateral: new anchor.web3.PublicKey("GoKbUcCHTTWS68mMa2j6v1E1n1gSosNCyUQpg2Z7Vhqj"),
        reserve: new anchor.web3.PublicKey("FNNkz4RCQezSSS71rW2tvqZH1LCkTzaiG7Nd1LeA5x5y"),
        reserveLiquiditySupply: new anchor.web3.PublicKey("HixjFJoeD2ggqKgFHQxrcJFjVvE5nXKuUPYNijFg7Kc5"),
        reserveCollateralMint: new anchor.web3.PublicKey("E2PSSXsXJGdpqhhaV3rYPpuy1inRCQAWxcdykA1DTmYr"),
        lendingMarket: new anchor.web3.PublicKey("GvjoVKNjBvQcFaSKUW1gTE7DxhSpjHbE69umVR5nPuQp"),
        lendingMarketAuthority: new anchor.web3.PublicKey("EhJ4fwaXUp7aiwvZThSUaGWCaBQAJe3AEaJJJVCn3UCK"),
        destinationDepositCollateral: new anchor.web3.PublicKey("FiUyeMAnZYkLCbrPGwjJWQwzYJ5AjD6p9N9fx6VxDPMt"),
        obligation: new anchor.web3.PublicKey("7WYn4tFoq38sVAEpdbdMsJ97YMZiexur9cUAetWnAhSt"),
        obligationOwner: new anchor.web3.PublicKey("4YPTC5LFiWNjcJjnaKSnZQgXEnGWgDcxwSLdozvCUUqE"),
        reserveLiquidityPythOracle: new anchor.web3.PublicKey("5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7"),
        reserveLiquiditySwitchboardOracle: new anchor.web3.PublicKey("CZx29wKMUxaJDq6aLVQTdViPL754tTR64NAgQBUGxxHb"),
        userTransferAuthority: new anchor.web3.PublicKey("4YPTC5LFiWNjcJjnaKSnZQgXEnGWgDcxwSLdozvCUUqE"),
        clock: SYSVAR_CLOCK_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID
    }
}