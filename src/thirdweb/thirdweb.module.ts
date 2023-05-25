import { Module } from "@nestjs/common";
import { ThirdwebService } from "./thirdweb.service";
import { ThirdwebController } from "./thirdweb.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ENV } from "src/constants";
import { User, UserSchema } from "./user.schema";

@Module({
  controllers: [ThirdwebController],
  providers: [ThirdwebService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: ENV.JWT_SECRET }),
  ],
})
export class ThirdwebModule {}
