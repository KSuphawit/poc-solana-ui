import {SolendProgramId} from "./Solend";
import * as anchor from "@project-serum/anchor";
import {SYSVAR_CLOCK_PUBKEY} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";


export const SolendWithdrawInfo = {
    "4YPTC5LFiWNjcJjnaKSnZQgXEnGWgDcxwSLdozvCUUqE": {
        poolProgram: SolendProgramId.DEV_NET,
        reserveCollateral: new anchor.web3.PublicKey("FiUyeMAnZYkLCbrPGwjJWQwzYJ5AjD6p9N9fx6VxDPMt"),
        userCollateral: new anchor.web3.PublicKey("GoKbUcCHTTWS68mMa2j6v1E1n1gSosNCyUQpg2Z7Vhqj"),
        reserve: new anchor.web3.PublicKey("FNNkz4RCQezSSS71rW2tvqZH1LCkTzaiG7Nd1LeA5x5y"),
        reserve2: new anchor.web3.PublicKey("5VVLD7BQp8y3bTgyF5ezm1ResyMTR3PhYsT4iHFU8Sxz"),
        obligation: new anchor.web3.PublicKey("7WYn4tFoq38sVAEpdbdMsJ97YMZiexur9cUAetWnAhSt"),
        lendingMarket: new anchor.web3.PublicKey("GvjoVKNjBvQcFaSKUW1gTE7DxhSpjHbE69umVR5nPuQp"),
        lendingMarketAuthority: new anchor.web3.PublicKey("EhJ4fwaXUp7aiwvZThSUaGWCaBQAJe3AEaJJJVCn3UCK"),
        userLiquidityToken: new anchor.web3.PublicKey("39XieSM6DMrE3sANqGeuASxe1Yw1hKPftSMKCdLm1e6W"),
        reserveCollateralMint: new anchor.web3.PublicKey("E2PSSXsXJGdpqhhaV3rYPpuy1inRCQAWxcdykA1DTmYr"),
        reserveLiquiditySupply: new anchor.web3.PublicKey("HixjFJoeD2ggqKgFHQxrcJFjVvE5nXKuUPYNijFg7Kc5"),
        obligationOwner: new anchor.web3.PublicKey("4YPTC5LFiWNjcJjnaKSnZQgXEnGWgDcxwSLdozvCUUqE"),
        userTransferAuthority: new anchor.web3.PublicKey("4YPTC5LFiWNjcJjnaKSnZQgXEnGWgDcxwSLdozvCUUqE"),
        reserveLiquidityPythOracle: new anchor.web3.PublicKey("5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7"),
        reserveLiquidityPythOracle2: new anchor.web3.PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
        reserveLiquiditySwitchboardOracle: new anchor.web3.PublicKey("CZx29wKMUxaJDq6aLVQTdViPL754tTR64NAgQBUGxxHb"),
        reserveLiquiditySwitchboardOracle2: new anchor.web3.PublicKey("AdtRGGhmqvom3Jemp5YNrxd9q9unX36BZk1pujkkXijL"),
        clock: SYSVAR_CLOCK_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID
    }
}