import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { NotificationService } from "./notification.service";
import { CreateNotificationInput } from "./notification.types";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { ENV } from "src/constants";
@Resolver("Notification")
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async createNotification(
    @Args("createNotificationInput")
    createNotificationInput: CreateNotificationInput,
    @User() user
  ): Promise<string> {
    if (!user) {
      return "User is not authenticated. Please try again";
    }

    // TODO: Uncomment this once we have a proper admin wallet or if ever needed to block this API
    // if (user.address !== ENV.KITAI_ADMIN_WALLET_ADDRESS)
    //   return "User is not authorized to access this API";
    return this.notificationService.create(createNotificationInput);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async storeFCMToken(
    @Args("fcmToken") fcmToken: string,
    @User() user
  ): Promise<string> {
    if (!user) {
      return "User is not authenticated. Please try again";
    }
    if (!fcmToken) {
      return "Please provide a valid FCM Token";
    }
    return this.notificationService.storeFCM(fcmToken, user);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async broadcastNotification(
    @Args("title") title: string,
    @Args("body") body: string,
    @User() user
  ): Promise<string> {
    if (!user) {
      return "User is not authenticated. Please try again";
    }

    if (user.address !== ENV.KITAI_ADMIN_WALLET_ADDRESS)
      return "User is not authorized to access this API";

    if (!title || !body) {
      return "Please provide all the required fields";
    }

    return this.notificationService.broadcastNotification(title, body);
  }
}
