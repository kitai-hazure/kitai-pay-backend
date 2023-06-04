import { Model } from "mongoose";
import { PaymentID } from "src/payments/paymentid.schema";

export const getPaymentID = async (paymentIDModel: Model<PaymentID>) => {
  const paymentID = await paymentIDModel.findOne();
  return paymentID.paymentID;
};

export const updatePaymentID = async (paymentIDModel: Model<PaymentID>) => {
  const paymentID = await paymentIDModel.findOne();
  paymentID.paymentID = paymentID.paymentID + 1;
  paymentID.save();
  return "PaymentID updated successfully";
};
