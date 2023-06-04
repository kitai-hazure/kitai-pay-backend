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
  ): Promise<number> {
    try {
      const { senders, receivers } = payment_object;
      const paymentID = await getPaymentID(this.paymentIDModel);
      await updatePaymentID(this.paymentIDModel);

      if (senders.length === 0 || receivers.length === 0) {
        throw new Error("Invalid Payment");
      }

      // hashing the data and sending it to the smart contract
      const hashedInput = {
        senders,
        receivers,
      };
      const SIGNATURE = HASH_PAYMENT(hashedInput, paymentID);
      try {
        await KITAI_PAY_CONTRACT.addPaymentSignature(paymentID, SIGNATURE);
      } catch (err) {
        console.log("ERROR IN CONTRACT: ", err);
        throw err;
      }

      const newPayment = new this.paymentModel({
        paymentID,
        senders: [],
        receivers: [],
        owner: user._id,
      });

      await newPayment.save();

      const senderForDB = [];
      const receiverForDB = [];
      const fcmTokens = [];

      for (let i = 0; i < senders.length; i++) {
        const senderDb = await this.userModel.findOne({
          address: senders[i].user,
        });
        fcmTokens.push(senderDb.fcmToken);
        senderDb.paymentIDs.push(newPayment._id);
        await senderDb.save();
        const objToPush = {
          user: senderDb._id.toString(),
          token: senders[i].token,
          amount: senders[i].amount,
        };
        senderForDB.push(objToPush);
      }

      for (let i = 0; i < receivers.length; i++) {
        const receiverDb = await this.userModel.findOne({
          address: receivers[i].user,
        });
        fcmTokens.push(receiverDb.fcmToken);
        receiverDb.paymentIDs.push(newPayment._id);
        await receiverDb.save();
        const objToPush = {
          user: receiverDb._id.toString(),
          token: receivers[i].token,
          amount: receivers[i].amount,
        };
        receiverForDB.push(objToPush);
      }

      const newPay = await this.paymentModel.findOneAndUpdate(
        { _id: newPayment._id },
        {
          senders: senderForDB,
          receivers: receiverForDB,
        }
      );
      await newPay.save();

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

      return paymentID;
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
