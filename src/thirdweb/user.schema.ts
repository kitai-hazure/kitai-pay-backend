import { Document } from "mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
@ObjectType()
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  @Field(() => String, { description: "User address" })
  address: string;

  @Prop({ required: false })
  @Field(() => String, { description: "User FCM Token" })
  fcmToken: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
