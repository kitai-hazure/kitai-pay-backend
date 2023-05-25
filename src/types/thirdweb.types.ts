export interface ThirdwebLoginPayload {
  address: string;
  chain_id: string;
  domain: string;
  expiration_time: string;
  invalid_before: string;
  issued_at: string;
  nonce: string;
  statement: string;
  type: "evm" | "solana";
  uri?: string;
  version: string;
  resources?: string[];
}

export interface ThirdwebLoginInput {
  payload: { payload: ThirdwebLoginPayload; signature: string };
}

export type ThirdwebLoginResponse = {
  address: string;
  _id: string;
  token: string;
};
