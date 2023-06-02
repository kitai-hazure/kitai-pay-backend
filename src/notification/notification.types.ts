import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateNotificationInput {
  @Field()
  title: string;

  @Field()
  body: string;

  @Field(() => [String])
  walletAddresses: string[] | undefined;
}
