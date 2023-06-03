import { Injectable } from "@nestjs/common";

@Injectable()
export class ContractService {
  hook(body: any) {
    return body;
  }
}
