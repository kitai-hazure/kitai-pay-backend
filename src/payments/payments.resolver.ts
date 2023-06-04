import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { PaymentsService } from "./payments.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { PaymentArray, PaymentInput } from "./payment.types";

@Resolver("")
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async createPayment(
    @Args("payment_input") payment_input: PaymentInput,
    @User() user
  ): Promise<string> {
    if (!user) {
      return "User is not authenticated. Please try again";
    }

    return await this.paymentsService.createPayment(payment_input, user);
  }

  @Query(() => [PaymentArray])
  @UseGuards(AuthGuard)
  async getPayments(@User() user): Promise<PaymentArray[]> {
    if (!user) {
      return null;
    }

    return await this.paymentsService.getPayments(user);
  }
}
