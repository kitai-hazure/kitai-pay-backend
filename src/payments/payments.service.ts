import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/thirdweb/user.schema";
import { Payment } from "./payments.schema";
import {
  sendPushNotificationToTopic,
  subscribeToTopic,
} from "src/helper/notification.helper";
import { PaymentArray, PaymentInput, PaymentReturn } from "./payment.types";
import { KITAI_PAY_CONTRACT, HASH_PAYMENT } from "../helper/ethers.helper";
import { PaymentID } from "./paymentid.schema";
import { getPaymentID, updatePaymentID } from "src/helper/paymentID.helper";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(PaymentID.name) private paymentIDModel: Model<PaymentID>
  ) {}

  // TODO -> ADD VALIDATIONS FOR THIS FUNCTION
  async createPayment(
    payment_object: PaymentInput,
    user: any
  ): Promise<string> {
    try {
      const { senders, receivers } = payment_object;
      const paymentID = await getPaymentID(this.paymentIDModel);
      await updatePaymentID(this.paymentIDModel);

      if (senders.length === 0 || receivers.length === 0) {
        return "Please provide at least one sender and one receiver";
      }
      const sendersForContract = [];
      const receiversForContract = [];

      for (let i = 0; i < senders.length; i++) {
        // get wallet address of senders
        const sender = senders[i];
        const senderUser = await this.userModel.findOne({ _id: sender.user });
        const senderWalletAddress = senderUser.address;
        sendersForContract.push({
          user: senderWalletAddress,
          token: sender.token,
          amount: sender.amount,
        });
      }

      for (let i = 0; i < receivers.length; i++) {
        const receiver = receivers[i];
        const receiverUser = await this.userModel.findOne({
          _id: receiver.user,
        });
        const receiverWalletAddress = receiverUser.address;
        receiversForContract.push({
          user: receiverWalletAddress,
          token: receiver.token,
          amount: receiver.amount,
        });
      }
      // hashing the data and sending it to the smart contract
      const hashedInput = {
        senders: sendersForContract,
        receivers: receiversForContract,
      };
      const SIGNATURE = HASH_PAYMENT(hashedInput, paymentID);
      await KITAI_PAY_CONTRACT.addPaymentSignature(paymentID, SIGNATURE);

      const newPayment = new this.paymentModel({
        paymentID,
        senders,
        receivers,
        owner: user._id,
      });

      await newPayment.save();
      const fcmTokens = [];

      for (let i = 0; i < senders.length; i++) {
        const sender = senders[i];
        const senderUser = await this.userModel.findOne({ _id: sender.user });
        fcmTokens.push(senderUser.fcmToken);
        senderUser.paymentIDs.push(newPayment._id);
        await senderUser.save();
      }

      for (let i = 0; i < receivers.length; i++) {
        const receiver = receivers[i];
        const receiverUser = await this.userModel.findOne({
          _id: receiver.user,
        });
        fcmTokens.push(receiverUser.fcmToken);
        receiverUser.paymentIDs.push(newPayment._id);
        await receiverUser.save();
      }

      // subscribe this to a paymentid topic and send notification
      subscribeToTopic(fcmTokens, newPayment._id.toString());

      sendPushNotificationToTopic({
        title: "New Payment",
        body: "A new payment has been created check kitai pay",
        topicName: newPayment._id.toString(),
        data: {
          paymentID: paymentID.toString(),
        },
      });

      return "Payment created syccessfully";
      // add this paymentid to the user's payment history
    } catch (err) {
      console.log("ERROR: ", err);
      return err.toString();
    }
  }

  async getPayments(user: User): Promise<PaymentArray[]> {
    try {
      const userObject = await this.userModel.findOne({ _id: user._id });
      const paymentIDs = userObject.paymentIDs;
      const payments: PaymentArray[] = [];
      for (let i = 0; i < paymentIDs.length; i++) {
        const paymentID = paymentIDs[i];
        const paymentObject = await this.paymentModel.findOne({
          _id: paymentID,
        });
        const sendersToSend: PaymentReturn[] = [];
        const receiversToSend: PaymentReturn[] = [];

        for (let j = 0; j < paymentObject.senders.length; j++) {
          const sender = paymentObject.senders[j];
          const obj = {
            user: sender.user.toString(),
            token: sender.token,
            amount: sender.amount,
          };
          sendersToSend.push(obj);
        }

        for (let j = 0; j < paymentObject.receivers.length; j++) {
          const receiver = paymentObject.receivers[j];
          const obj = {
            user: receiver.user.toString(),
            token: receiver.token,
            amount: receiver.amount,
          };
          receiversToSend.push(obj);
        }

        const objectToPush: PaymentArray = {
          _id: paymentObject._id.toString(),
          senders: sendersToSend,
          receivers: receiversToSend,
          paymentID: paymentObject.paymentID,
        };
        payments.push(objectToPush);
      }

      return payments;
    } catch (err) {
      console.log("ERROR: ", err);
      return null;
    }
  }
}
