import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import idl from "configs/idl.json";
import { Program, Provider } from "@project-serum/anchor";

export const PROGRAM_ID = new PublicKey(idl.metadata.address);

const opts = {
  preflightCommitment: "processed",
};

export const getConnection = (cluster) => {
  const network = clusterApiUrl(cluster);

  return new Connection(network, opts.preflightCommitment);
};

export const getProvider = (cluster) => {
  const connection = getConnection(cluster);

  return new Provider(connection, window.solana, opts.preflightCommitment);
};

export const getProgram = (cluster) => {
  const provider = getProvider(cluster);

  return new Program(idl, PROGRAM_ID, provider);
};
