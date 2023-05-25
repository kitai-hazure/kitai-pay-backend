import * as FCM from "fcm-node";
import { ENV } from "../constants/env";
import { ISendMessageType } from "../types/notification.types";

const FCM_INSTANCE = new FCM(ENV.FCM_SERVER_KEY);

export const sendPushNotification = ({
  title,
  body,
  fcmToken,
}: ISendMessageType) => {
  const MESSAGE_TO_SEND = {
    to: fcmToken,
    notification: {
      title,
      body,
    },
    // CAN INCLUDE DATA PROP TOO CHECK DOCS....
  };

  FCM_INSTANCE.send(MESSAGE_TO_SEND, (err, response) => {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
