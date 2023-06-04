import { Document } from "mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
@ObjectType()
export class PaymentID {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => Number)
  @Prop({ default: 0 })
  paymentID: number;
}

export type PaymentIDDocument = PaymentID & Document;

export const PaymentIDSchema = SchemaFactory.createForClass(PaymentID);
