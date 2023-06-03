import * as FCM from "fcm-node";
import { ENV } from "../constants/env";
import {
  ISendMessageType,
  ISendTopicMessageType,
} from "../types/notification.types";

const FCM_INSTANCE = new FCM(ENV.FCM_SERVER_KEY);

export const sendPushNotification = ({
  title,
  body,
  data,
  fcmTokens,
}: ISendMessageType) => {
  const MESSAGE_TO_SEND = {
    registration_ids: fcmTokens,
    notification: {
      title,
      body,
    },
    data,
  };

  sendMessage(MESSAGE_TO_SEND);
};

export const sendPushNotificationToTopic = ({
  title,
  body,
  data,
  topicName,
}: ISendTopicMessageType) => {
  const MESSAGE_TO_SEND = {
    to: `/topics/${topicName}`,
    notification: {
      title,
      body,
    },
    data,
  };
  sendMessage(MESSAGE_TO_SEND);
};

export const subscribeToTopic = (fcmTokens: string[], topicName: string) => {
  FCM_INSTANCE.subscribeToTopic(fcmTokens, topicName, (err, response) => {
    if (err) {
      console.log("Error subscribing to topic: ", err);
    } else {
      console.log("Successfully subscribed to topic: ", response);
    }
  });
};

export const unsubscribeFromTopic = (
  fcmTokens: string[],
  topicName: string
) => {
  FCM_INSTANCE.unsubscribeToTopic(fcmTokens, topicName, (err, response) => {
    if (err) {
      console.log("Error unsubscribing from topic: ", err);
    } else {
      console.log("Successfully unsubscribed from topic: ", response);
    }
  });
};

const sendMessage = (message: any) => {
  FCM_INSTANCE.send(message, (err, response) => {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
