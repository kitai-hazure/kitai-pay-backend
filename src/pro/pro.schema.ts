import { Document } from "mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
@ObjectType()
export class Pro {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field(() => String, { description: "Pro Title" })
  title: string;

  @Prop()
  @Field(() => String, { description: "Pro Description" })
  description: string;
}

export type ProDocument = Pro & Document;

export const ProSchema = SchemaFactory.createForClass(Pro);
