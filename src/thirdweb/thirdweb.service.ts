import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ThirdwebLoginInput,
  ThirdwebLoginPayload,
  ThirdwebLoginResponse,
} from "src/types";
import { User } from "./user.schema";
import { JwtService } from "@nestjs/jwt";
import { ethers } from "ethers";

function generateMessage(payload: ThirdwebLoginPayload) {
  const typeField = payload.type === "evm" ? "Ethereum" : "Solana";
  const header = `${payload.domain} wants you to sign in with your ${typeField} account:`;
  let prefix = [header, payload.address].join("\n");
  prefix = [prefix, payload.statement].join("\n\n");
  if (payload.statement) {
    prefix += "\n";
  }
  const suffixArray = [];
  if (payload.uri) {
    const uriField = `URI: ${payload.uri}`;
    suffixArray.push(uriField);
  }
  const versionField = `Version: ${payload.version}`;
  suffixArray.push(versionField);
  if (payload.chain_id) {
    const chainField = `Chain ID: ` + payload.chain_id || "1";
    suffixArray.push(chainField);
  }
  const nonceField = `Nonce: ${payload.nonce}`;
  suffixArray.push(nonceField);
  const issuedAtField = `Issued At: ${payload.issued_at}`;
  suffixArray.push(issuedAtField);
  const expiryField = `Expiration Time: ${payload.expiration_time}`;
  suffixArray.push(expiryField);
  if (payload.invalid_before) {
    const invalidBeforeField = `Not Before: ${payload.invalid_before}`;
    suffixArray.push(invalidBeforeField);
  }
  if (payload.resources) {
    suffixArray.push(
      [`Resources:`, ...payload.resources.map((x) => `- ${x}`)].join("\n")
    );
  }
  const suffix = suffixArray.join("\n");
  return [prefix, suffix].join("\n");
}

@Injectable()
export class ThirdwebService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async login(body: ThirdwebLoginInput): Promise<ThirdwebLoginResponse> {
    const { signature, payload } = body.payload;
    const address = payload?.address;

    if (payload === undefined)
      throw new BadRequestException("payload is required");
    if (signature === undefined)
      throw new BadRequestException("signature is required");
    if (address === undefined)
      throw new BadRequestException("address is required");

    if (payload.type !== "evm" || payload.type === undefined)
      throw new BadRequestException("invalid payload type");
    // TODO: add check for domain, if not our domain throw error
    // TODO: add nonce to db and check if already used, if so throw error

    const issuedAt = new Date(payload.issued_at);
    const invalidBefore = new Date(payload.invalid_before);
    const expirationTime = new Date(payload.expiration_time);
    const now = new Date();

    if (now < issuedAt)
      throw new BadRequestException(
        "Invalid request, issued_at is in the future"
      );
    if (now > expirationTime)
      throw new BadRequestException("Invalid request, token has expired");
    if (now < invalidBefore)
      throw new BadRequestException("Invalid request, token is not valid yet");

    const verified =
      ethers
        .verifyMessage(generateMessage(payload), signature)
        .toLowerCase() === address.toLowerCase();

    if (!verified) throw new BadRequestException("invalid signature");

    let user = await this.userModel.findOne({ address });
    if (!user) {
      user = new this.userModel({ address });
      await user.save();
    }

    const token = this.jwtService.sign({
      address: user.address,
      _id: user._id.toString(),
    });

    return {
      address: user.address,
      _id: user._id.toString(),
      token,
    };
  }
}
