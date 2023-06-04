import { InputType, Field, ObjectType } from "@nestjs/graphql";

@InputType()
export class PaymentAtom {
  @Field()
  user: string;

  @Field()
  amount: number;

  @Field()
  token: string;
}

@InputType()
export class PaymentInput {
  @Field(() => [PaymentAtom])
  senders: PaymentAtom[];

  @Field(() => [PaymentAtom])
  receivers: PaymentAtom[];
}

@ObjectType()
export class PaymentReturn {
  @Field()
  user: string;

  @Field()
  amount: number;

  @Field()
  token: string;
}

@ObjectType()
export class PaymentArray {
  @Field()
  _id: string;

  @Field(() => [PaymentReturn])
  senders: PaymentReturn[];

  @Field(() => [PaymentReturn])
  receivers: PaymentReturn[];

  @Field()
  paymentID: number;
}
