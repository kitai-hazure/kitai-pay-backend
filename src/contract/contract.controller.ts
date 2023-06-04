import { Controller, Post, Body } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { sendPushNotificationToTopic } from "src/helper/notification.helper";
import { subscribeToTopic } from "src/helper/notification.helper";

@Controller("contract")
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post("hook")
  async hook(@Body() body) {
    subscribeToTopic(
      [
        "fcvRfyxNSfyrJRbZazdOly:APA91bEpZsD8heFoNq0chpEGhSvcpRqkSU5RO0LxwbFY8EtE1oDtExwGVJFFu3hf0EaoXMl-FM0frN9FzGsFlq3oPduEtCCG9Sb3axym-Jqtqp3wKln8WJ5hfiPvwAgrEEbCbDcbkaDU",
      ],
      "contract"
    );
    sendPushNotificationToTopic({
      title: "Event from Webhook",
      body: "A new event has been created check kitai pay",
      topicName: "contract",
      data: body,
    });
    return this.contractService.hook(body);
  }
}
