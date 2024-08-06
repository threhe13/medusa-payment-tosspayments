import { EOL } from "os";
import {
  AbstractPaymentProcessor,
  isPaymentProcessorError,
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus,
} from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import TossPaymentsBase from "../core/tosspayments";
import { Payment } from "../types/paymentType";

interface TosspaymentsProcessorOptions {
  key: string;
  version: string;
  debug?: boolean;
}

class TossPaymentsProcessor extends AbstractPaymentProcessor {
  static identifier: string = "tosspayments";

  protected container_: Record<string, unknown>;
  protected readonly options_:
    | TosspaymentsProcessorOptions
    | Record<string, unknown>
    | undefined;

  private tosspayments_: TossPaymentsBase;

  constructor(
    container: Record<string, unknown>,
    options: Record<string, unknown> | undefined
  ) {
    super(container, options);

    // you can access options here
    // you can also initialize a client that
    // communicates with a third-party service.
    this.container_ = container;
    this.options_ = {
      key: options.tosspayments_key,
      version: options.tosspayments_version,
      debug: options.is_debug,
    };

    if (!options.tosspayments_key || !options.tosspayments_version) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Tosspayments processor need the tosspayments_key in options of medusa config"
      );
    }

    /**
     * Required TossPayments Options:
     * - tosspayments_key(secret key): string
     * - tosspayments_version: string;
     */
    this.tosspayments_ = new TossPaymentsBase(
      this.options_.key,
      this.options_.version
    );
  }

  /**
   * FRONTSTORE
   * - initiatePayment
   * - updatePayment
   * - updatePaymentData
   * - authorizePayment
   */

  /**
   * This method is called either if a region has only one payment provider enabled or when a Payment Session is selected,
   * which occurs when the customer selects their preferred payment method during checkout.
   * It is used to allow you to make any necessary calls to the third-party provider to initialize the payment.
   * For example, in Stripe this method is used to create a Payment Intent for the customer.
   *
   * @param context
   */
  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    if (this.options_.debug) {
      console.info(
        "TOSSPAYMENTS_PAYMENT_DEBUG: initiatePayment",
        JSON.stringify(context, null, 2)
      );
    }

    const { resource_id, email, amount } = context;

    try {
      const paymentIntent = this.tosspayments_.initialize({
        id: resource_id,
        email,
        amount,
      });

      return {
        session_data: paymentIntent,
      };
    } catch (error) {
      return this.buildError(
        "Error in initiatePayment when initializing Tosspayments",
        error
      );
    }
  }

  /**
   * This method is used to update the payment session when the payment amount changes.
   * It's called whenever the cart or any of its related data is updated.
   * For example, when a line item is added to the cart or when a shipping method is selected.
   *
   * @param context
   * @returns
   */
  async updatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void> {
    if (this.options_.debug) {
      console.info(
        "TOSSPAYMENTS_PAYMENT_DEBUG: updatePayment",
        JSON.stringify(context, null, 2)
      );
    }

    const { resource_id, amount } = context;

    const paymentIntent = this.tosspayments_.retrieve();
    if (this.options_.debug) {
      console.info(
        "TOSSPAYMENTS_PAYMENT_DEBUG: paymentIntent in updatePayment",
        JSON.stringify(paymentIntent, null, 2)
      );
    }

    try {
      if (!paymentIntent || paymentIntent.id !== resource_id) {
        const reInitiatePayment = await this.initiatePayment(context);
        if (isPaymentProcessorError(reInitiatePayment)) {
          return this.buildError(
            "Error in updatePayment during the re-initiate of the new payment for new customer",
            reInitiatePayment
          );
        }
        return reInitiatePayment;
      }

      if (!paymentIntent.email || paymentIntent.amount !== amount) {
        const updatedPaymentIntent = this.tosspayments_.update({
          email: context.email,
          amount: context.amount,
        });

        return { session_data: updatedPaymentIntent };
      }

      const updatedPaymentIntent = this.tosspayments_.update(
        context.paymentSessionData
      );
      if (this.options_.debug) {
        console.info(
          "TOSSPAYMENTS_PAYMENT_DEBUG: updated paymentIntent in updatePayment",
          JSON.stringify(updatedPaymentIntent, null, 2)
        );
      }

      return { session_data: updatedPaymentIntent };
    } catch (error) {
      return this.buildError(
        "Error in updatePayment during the retrieve of the cart",
        error
      );
    }
  }

  /**
   * This method is used to update the data field of a payment session.
   * It's called when a request is sent to the Update Payment Session API Route, or when the CartService's updatePaymentSession is used.
   * This method can also be used to update the data in the third-party payment provider, if necessary.
   *
   * @param sessionId
   * @param data
   * @returns
   */
  async updatePaymentData(
    sessionId: string,
    data: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    if (this.options_.debug) {
      console.info(
        "TOSSPAYMENTS_PAYMENT_DEBUG: updatePaymentData",
        JSON.stringify(data, null, 2)
      );
    }

    try {
      const paymentIntent = this.tosspayments_.retrieve();
      if (data.amount !== paymentIntent.amount) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Can not update amount from updatePaymentData"
        );
      }

      return {
        ...data,
      };
    } catch (error) {
      return this.buildError(
        "Error in updatePaymentData during the retrieve of the custom data",
        error
      );
    }
  }

  /**
   * This method is used to get the status of a Payment or a Payment Session.
   * Its main usage is within the place order and create swap flows.
   * If the status returned is not authorized within these flows, then the payment is considered failed and an error will be thrown, stopping the flow from completion.
   *
   * @param paymentSessionData
   * @returns
   */
  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    if (this.options_.debug) {
      console.info(
        "TOSSPAYMENTS_PAYMENT_DEBUG: getPaymentStatus",
        JSON.stringify(paymentSessionData, null, 2)
      );
    }

    const id = paymentSessionData.id as string;
    if (!id) {
      return PaymentSessionStatus.PENDING;
    }

    const tosspaymentsStatus = this.tosspayments_.getStatus();
    switch (tosspaymentsStatus) {
      case "READY":
        return PaymentSessionStatus.PENDING;
      case "CANCELED":
      case "PARTIAL_CANCELED":
        return PaymentSessionStatus.CANCELED;
      case "ABORTED":
      case "EXPIRED":
        return PaymentSessionStatus.ERROR;
      case "IN_PROGRESS":
      case "WAITING_FOR_DEPOSIT":
      case "DONE":
        return PaymentSessionStatus.AUTHORIZED;
      default:
        return PaymentSessionStatus.PENDING;
    }
  }

  /**
   * This method is used to authorize payment using the Payment Session of an order. This is called when the cart is completed and before the order is created.
   * This method is also used for authorizing payments of a swap of an order and when authorizing sessions in a payment collection.
   * You can interact with a third-party provider and perform any actions necessary to authorize the payment.
   * The payment authorization might require additional action from the customer before it is declared authorized.
   * Once that additional action is performed, the authorizePayment method will be called again to validate that the payment is now fully authorized.
   * So, make sure to implement it for this case as well, if necessary.
   * Once the payment is authorized successfully and the Payment Session status is set to authorized, the associated order or swap can then be placed or created.
   * If the payment authorization fails, then an error will be thrown and the order will not be created.
   *
   * @param paymentSessionData
   * @param context
   * @returns
   */
  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | {
        status: PaymentSessionStatus;
        data: PaymentProcessorSessionResponse["session_data"];
      }
  > {
    if (this.options_.debug) {
      console.info(
        "TOSSPAYMENTS_PAYMENT_DEBUG: authorizePayment",
        JSON.stringify({ sessionData: paymentSessionData, context }, null, 2)
      );
    }

    try {
      const { paymentKey, orderId, amount } = paymentSessionData;

      if (!paymentKey || !orderId || !amount)
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can not find necessary keys in authorizePayment"
        );

      const paymentData = {
        paymentKey: paymentKey as string,
        orderId: orderId as string,
        amount: amount as number,
      };

      const paymentResult = (await this.tosspayments_.confirm(
        paymentData
      )) as Payment;
      if (this.options_.debug) {
        console.info(
          "TOSSPAYMENTS_PAYMENT_DEBUG: Confirm payment in authorizaePayment",
          JSON.stringify(paymentResult, null, 2)
        );
      }

      const status = await this.getPaymentStatus(paymentSessionData);

      return {
        data: {
          ...paymentSessionData,
          receipt: paymentResult.receipt.url,
          checkout: paymentResult.checkout.url,
          method: paymentResult.method,
          card: paymentResult.card,
        },
        status,
      };
    } catch (error) {
      return this.buildError(
        "Error in authorizePayment during the request to tosspayments api",
        error
      );
    }
  }

  /**
   * This method is used to provide a uniform way of retrieving the payment information from the third-party provider.
   * For example, in Stripe’s Payment Processor this method is used to retrieve the payment intent details from Stripe.
   *
   * @param paymentSessionData
   * @returns
   */
  async retrievePayment(
    paymentSessionData: Record<string, unknown> & { paymentKey: string }
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    if (this.options_.debug) {
      console.info(
        "TOSSPAYMENTS_PAYMENT_DEBUG: retrievePayment",
        JSON.stringify({ paymentSessionData }, null, 2)
      );
    }

    const { paymentKey } = paymentSessionData;

    try {
      if (!paymentKey) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Can not find necessary keys in retrievePayment"
        );
      }

      const paymentResult = (await this.tosspayments_.inquiry(
        paymentKey
      )) as Payment;

      if (this.options_.debug) {
        console.info(
          "TOSSPAYMENTS_PAYMENT_DEBUG: Inquiry payment detail in retrievePayment",
          JSON.stringify(paymentResult, null, 2)
        );
      }

      return { ...paymentSessionData };
    } catch (error) {
      return this.buildError(
        "Error in retrievePayment getting payment information from tosspayments api",
        error
      );
    }
  }

  /**
   * ADMIN PANEL
   * - refundPayment
   * - capturePayment
   * - cancelPayment
   * - deletePayment
   */

  /**
   * This method is used to refund an order’s payment. This is typically triggered manually by the store operator from the admin.
   * The refund amount might be the total order amount or part of it.
   * This method is also used for refunding payments of a swap or a claim of an order, or when a request is sent to the Refund Payment API Route.
   * You can utilize this method to interact with the third-party provider and perform any actions necessary to refund the payment.
   *
   * @param paymentSessionData
   * @param refundAmount
   * @returns
   */
  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    if (this.options_.debug) {
      console.info(
        "TOSSPAYMENTS_PAYMENT_DEBUG: refundPayment",
        JSON.stringify({ paymentSessionData, refundAmount }, null, 2)
      );
    }

    try {
      const { paymentKey } = paymentSessionData;

      if (!paymentKey) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Can not find necessary keys in refundPayment"
        );
      }

      const paymentResult = (await this.tosspayments_.cancel(
        paymentKey as string,
        ""
      )) as Payment;
      if (this.options_.debug) {
        console.info(
          "TOSSPAYMENTS_PAYMENT_DEBUG: Refund payment in refundPayment",
          JSON.stringify(paymentResult, null, 2)
        );
      }

      return paymentSessionData;
    } catch (error) {
      return this.buildError("Error in refundPayment", error);
    }
  }

  /**
   * This method is used to capture the payment amount of an order. This is typically triggered manually by the store operator from the admin.
   * This method is also used for capturing payments of a swap of an order, or when a request is sent to the Capture Payment API Route.
   * You can utilize this method to interact with the third-party provider and perform any actions necessary to capture the payment.
   *
   * 토스페이먼츠에서는 결제 승인과 동시에 매입이 일어나므로 사용하지 않는다.
   *
   * @param paymentSessionData
   */
  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    return paymentSessionData;
  }

  /**
   * This method is used to cancel an order’s payment. This method is typically triggered by one of the following situations:
   * 1. Before an order is placed and after the payment is authorized,
   *    an inventory check is done on products to ensure that products are still available for purchase.
   *    If the inventory check fails for any of the products, the payment is canceled.
   * 2. If the store operator cancels the order from the admin.
   * 3. When the payment of an order's swap is canceled.
   * You can utilize this method to interact with the third-party provider and perform any actions necessary to cancel the payment.
   *
   * @param paymentSessionData
   * @returns
   */
  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    return paymentSessionData;
  }

  /**
   * This method is used to perform any actions necessary before a Payment Session is deleted. The Payment Session is deleted in one of the following cases:
   * 1. When a request is sent to delete the Payment Session.
   * 2. When the Payment Session is refreshed. The Payment Session is deleted so that a newer one is initialized instead.
   * 3. When the Payment Processor is no longer available. This generally happens when the store operator removes it from the available Payment Processor in the admin.
   * 4. When the region of the store is changed based on the cart information and the Payment Processor is not available in the new region.
   *
   * @param paymentSessionData
   * @returns
   */
  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    return paymentSessionData;
  }

  protected buildError(
    message: string,
    e: PaymentProcessorError | Error
  ): PaymentProcessorError {
    return {
      error: message,
      code: "code" in e ? e.code : "",
      detail: isPaymentProcessorError(e)
        ? `${e.error}${EOL}${e.detail ?? ""}`
        : "detail" in e
        ? e.detail
        : e.message ?? "",
    };
  }
}

export default TossPaymentsProcessor;
