import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationResolver } from "./notification.resolver";
import { JwtModule } from "@nestjs/jwt";
import { ENV } from "src/constants";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/thirdweb/user.schema";
@Module({
  providers: [NotificationResolver, NotificationService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: ENV.JWT_SECRET }),
  ],
})
export class NotificationModule {}
