import { Injectable } from "@nestjs/common";
import { sendPushNotification } from "src/helper/notification.helper";
import { CreateNotificationInput } from "./notification.types";

@Injectable()
export class NotificationService {
  create(createNotificationInput: CreateNotificationInput): string {
    const { title, body } = createNotificationInput;
    // TODO -> GET THE FCM TOKEN OF THE USER FROM THE AUTH TOKEN
    const fcmToken =
      "fcvRfyxNSfyrJRbZazdOly:APA91bEpZsD8heFoNq0chpEGhSvcpRqkSU5RO0LxwbFY8EtE1oDtExwGVJFFu3hf0EaoXMl-FM0frN9FzGsFlq3oPduEtCCG9Sb3axym-Jqtqp3wKln8WJ5hfiPvwAgrEEbCbDcbkaDU";
    try {
      sendPushNotification({
        title,
        body,
        fcmToken,
      });

      return "Notification sent successfully";
    } catch (err) {
      return err.toString();
    }
  }
}
