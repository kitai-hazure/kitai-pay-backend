import { ethers } from "ethers";
import { ENV } from "src/constants";
import * as KITAI_PAY_CONTRACT_ARTIFACT from "src/artifacts/KitaiPay.json";

export const getWallet = (privateKey: string) => {
  const provider = new ethers.JsonRpcProvider(ENV.LUMIVERSE_RPC_URL);
  return new ethers.Wallet(privateKey, provider);
};

export const KITAI_SIGNER = getWallet(ENV.PRIVATE_KEY);

export const KITAI_PAY_CONTRACT = new ethers.Contract(
  ENV.KITAI_PAY_CONTRACT_ADDRESS,
  KITAI_PAY_CONTRACT_ARTIFACT.abi,
  KITAI_SIGNER
);

export const HASH_PAYMENT = (payment_object: any, payment_id: number) => {
  const abiCoder = new ethers.AbiCoder();

  let SIGNATURE = ethers.keccak256(abiCoder.encode(["uint256"], [payment_id]));

  for (let i = 0; i < payment_object["senders"].length; i++) {
    SIGNATURE = ethers.keccak256(abiCoder.encode(["bytes32"], [SIGNATURE]));
    SIGNATURE = ethers.keccak256(
      abiCoder.encode(["address"], [payment_object["senders"][i]["user"]])
    );
    SIGNATURE = ethers.keccak256(
      abiCoder.encode(["address"], [payment_object["senders"][i]["token"]])
    );
    SIGNATURE = ethers.keccak256(
      abiCoder.encode(["uint256"], [payment_object["senders"][i]["amount"]])
    );
  }

  for (let i = 0; i < payment_object["receivers"].length; i++) {
    SIGNATURE = ethers.keccak256(abiCoder.encode(["bytes32"], [SIGNATURE]));
    SIGNATURE = ethers.keccak256(
      abiCoder.encode(["address"], [payment_object["receivers"][i]["user"]])
    );
    SIGNATURE = ethers.keccak256(
      abiCoder.encode(["address"], [payment_object["receivers"][i]["token"]])
    );
    SIGNATURE = ethers.keccak256(
      abiCoder.encode(["uint256"], [payment_object["receivers"][i]["amount"]])
    );
  }

  return SIGNATURE;
};
