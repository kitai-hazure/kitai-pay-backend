import { Document } from "mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
@ObjectType()
export class Payment {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => Number)
  @Prop({ required: true })
  paymentID: number;

  @Field(() => [Object])
  @Prop({ required: true })
  senders: [
    {
      user: MongooseSchema.Types.ObjectId;
      token: string;
      amount: number;
    }
  ];

  @Field(() => [Object])
  @Prop({ required: true })
  receivers: [
    {
      user: MongooseSchema.Types.ObjectId;
      token: string;
      amount: number;
    }
  ];

  @Field(() => Boolean)
  @Prop({ default: false })
  completed: boolean;

  @Field(() => Boolean)
  @Prop({ default: false })
  cancelled: boolean;

  @Field(() => MongooseSchema.Types.ObjectId)
  @Prop({ required: true })
  owner: MongooseSchema.Types.ObjectId;
}

export type PaymentDocument = Payment & Document;

export const PaymentSchema = SchemaFactory.createForClass(Payment);
