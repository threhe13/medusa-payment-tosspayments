import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Payment, TossPaymentsErrorType, PaymentStatus } from "../types";
import { PaymentSessionData } from "@medusajs/medusa";

class TossPaymentsBase {
  private tosspaymentsApi: AxiosInstance;

  protected readonly secretKey: string;
  protected status: PaymentStatus;
  protected paymentIntent: Record<string, unknown>;

  private readonly baseUrl = "/v1/payments";

  constructor(secretKey: unknown, version: unknown) {
    if (typeof secretKey !== "string" || typeof version !== "string") {
      throw new Error("Failed to detect secret key or api version");
    }

    if (version !== "2022-11-16") {
      throw new Error(
        "TossPayments api version is different, only support version 2022-11-16"
      );
    }

    this.tosspaymentsApi = axios.create({
      baseURL: "https://api.tosspayments.com",
      headers: {
        Authorization: `Basic ${secretKey}`,
      },
    });
  }

  getStatus() {
    return this.status;
  }

  /**
   *
   * @param sessionData
   */
  initialize({
    id,
    email,
    amount,
  }: {
    id: string;
    email: string;
    amount: number;
  }): Record<string, unknown> {
    this.status = "READY";
    this.paymentIntent = { id, email, amount };
    return this.paymentIntent;
  }

  update(data: PaymentSessionData): Record<string, unknown> {
    this.paymentIntent = { ...data };
    return this.paymentIntent;
  }

  retrieve(): Record<string, unknown> {
    return this.paymentIntent;
  }

  /**
   * TOSSPAYMENTS API
   */

  /**
   * paymentKey에 해당하는 결제를 검증하고 승인합니다.
   * 결제 인증이 유효한 10분 안에 상점에서 결제 승인 API를 호출하지 않으면 해당 결제는 만료됩니다.
   *
   * @param data<{paymentKey: string, orderId: string, amount: number}>
   * @returns
   */
  async confirm(data: {
    paymentKey: string;
    orderId: string;
    amount: number;
  }): Promise<Payment | TossPaymentsErrorType> {
    try {
      const paymentResult = await this.tosspaymentsApi.post(
        `${this.baseUrl}/confirm`,
        {
          paymentKey: data.paymentKey,
          orderId: data.orderId,
          amount: data.amount,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      this.status = paymentResult.data.status;
      return paymentResult.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Tosspayments API Error with status code ${error.response.status}: ${error.response.data.code} ${error.response.data.message}`
        );
      }
      throw error;
    }
  }

  /**
   * 승인된 결제를 paymentKey로 조회합니다.
   * paymentKey는 SDK를 사용해 결제할 때 발급되는 고유한 키 값이며, orderId는 SDK로 결제를 요청할 때 가맹점에서 만들어서 사용한 값입니다.
   * 결제가 최종 승인된 후 돌아오는 Payment 객체에 담겨있습니다.
   *
   * @param paymentKey
   */
  async inquiry(paymentKey: string): Promise<Payment | TossPaymentsErrorType> {
    const url = `${this.baseUrl}/${paymentKey}`;
    try {
      if (!paymentKey)
        throw new Error(
          "[Tosspayments Core] Can not find paymentKey in inquiry"
        );

      const paymentResult = await this.tosspaymentsApi.get(url);
      return paymentResult.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Tosspayments API Error with status code ${error.response.status}: ${error.response.data.code} ${error.response.data.message}`
        );
      }
      throw error;
    }
  }

  /**
   * 승인된 결제를 paymentKey로 취소합니다. 취소 이유를 cancelReason에 추가해야 합니다.
   * 결제 금액의 일부만 부분 취소하려면 cancelAmount에 취소할 금액을 추가해서 API를 요청합니다. (cancelAmount에 값을 넣지 않으면 전액 취소됩니다.)
   * 멱등키를 요청 헤더에 추가하면 중복 취소 없이 안전하게 처리됩니다.
   *
   * @param paymentKey
   * @param reason
   * @param amount
   * @returns
   */
  async cancel(
    paymentKey: string,
    reason: string,
    amount?: number
  ): Promise<Payment | TossPaymentsErrorType> {
    try {
      if (!paymentKey)
        throw new Error(
          "[Tosspayments Core] Can not find paymentKey in cancel"
        );

      const requestOption = {
        cancelReason: reason,
      };

      if (amount) {
        requestOption["cancelAmount"] = amount;
      }

      const paymentResult = await this.tosspaymentsApi.post(
        `${this.baseUrl}/${paymentKey}/cancel`,
        requestOption,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return paymentResult.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Tosspayment API Error with status code ${error.response.status}: ${error.response.data.code} ${error.response.data.message}`
        );
      }
      throw error;
    }
  }
}

export default TossPaymentsBase;
