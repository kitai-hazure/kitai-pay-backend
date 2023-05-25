import { Body, Controller, Post } from "@nestjs/common";
import { ThirdwebService } from "./thirdweb.service";
import { ThirdwebLoginInput, ThirdwebLoginResponse } from "src/types";

@Controller("thirdweb")
export class ThirdwebController {
  constructor(private readonly thirdwebService: ThirdwebService) {}

  @Post("login")
  async login(
    @Body() body: ThirdwebLoginInput
  ): Promise<ThirdwebLoginResponse> {
    return await this.thirdwebService.login(body);
  }
}
