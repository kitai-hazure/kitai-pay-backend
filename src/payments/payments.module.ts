import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsResolver } from "./payments.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentSchema } from "./payments.schema";
import { UserSchema } from "src/thirdweb/user.schema";
import { JwtModule } from "@nestjs/jwt";
import { ENV } from "src/constants";
import { PaymentIDSchema } from "./paymentid.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    MongooseModule.forFeature([{ name: "Payment", schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: "PaymentID", schema: PaymentIDSchema }]),
    JwtModule.register({ secret: ENV.JWT_SECRET }),
  ],
  providers: [PaymentsResolver, PaymentsService],
})
export class PaymentsModule {}
