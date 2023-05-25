import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { NotificationService } from "./notification.service";
import { CreateNotificationInput } from "./notification.types";

@Resolver("Notification")
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => String)
  createNotification(
    @Args("createNotificationInput")
    createNotificationInput: CreateNotificationInput
  ): string {
    return this.notificationService.create(createNotificationInput);
  }
}
