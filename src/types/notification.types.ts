export interface ISendMessageType {
  title: string;
  body: string;
  fcmTokens: string[] | undefined;
  data?: any;
}

export interface ISendTopicMessageType {
  title: string;
  body: string;
  topicName: string;
  data?: any;
}
