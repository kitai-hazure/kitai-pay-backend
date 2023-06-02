import { Injectable } from "@nestjs/common";
import { sendPushNotification } from "src/helper/notification.helper";
import { CreateNotificationInput } from "./notification.types";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/thirdweb/user.schema";

@Injectable()
export class NotificationService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    createNotificationInput: CreateNotificationInput
  ): Promise<string> {
    try {
      const { title, body, walletAddresses } = createNotificationInput;
      if (!title || !body || !walletAddresses || walletAddresses.length === 0) {
        return "Please provide all the required fields";
      }

      const fcmTokens = await this.userModel
        .find({ address: { $in: walletAddresses } })
        .distinct("fcmToken");

      if (fcmTokens.length === 0) {
        return "No FCM tokens found with the provided wallet addresses";
      }

      sendPushNotification({
        title,
        body,
        fcmTokens,
      });

      return "Notification(s) sent successfully";
    } catch (err) {
      return err.toString();
    }
  }

  async storeFCM(fcmToken: string, user: any): Promise<string> {
    try {
      const currUser = await this.userModel.findOne({ _id: user._id });
      if (!currUser) {
        return "User not found";
      }
      currUser.fcmToken = fcmToken;
      await currUser.save();
      return "FCM Token stored successfully";
    } catch (err) {
      return err.toString();
    }
  }

  async broadcastNotification(title: string, body: string): Promise<string> {
    try {
      const fcmTokens = await this.userModel.find().distinct("fcmToken");
      if (fcmTokens.length === 0) {
        return "No FCM tokens found";
      }
      sendPushNotification({
        title,
        body,
        fcmTokens,
      });
      return "Notification(s) sent successfully";
    } catch (err) {
      return err.toString();
    }
  }
}
