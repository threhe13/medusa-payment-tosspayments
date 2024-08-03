// 카드 종류입니다. 신용, 체크, 기프트, 미확인 중 하나입니다. 고객이 해외 카드로 결제했거나 간편결제의 결제 수단을 조합해서 결제했을 때 미확인으로 표시됩니다.
type CardType = "신용" | "체크" | "기프트" | "미확인";

// 카드의 소유자 타입입니다. 개인, 법인, 미확인 중 하나입니다. 고객이 해외 카드로 결제했거나 간편결제의 결제 수단을 조합해서 결제했을 때 미확인으로 표시됩니다.
type OwnerType = "개인" | "법인" | "미확인";

/**
 * 카드 결제의 매입 상태입니다. 아래와 같은 상태 값을 가질 수 있습니다.
 *
 * READY: 아직 매입 요청이 안 된 상태입니다.
 * REQUEST: 매입이 요청된 상태입니다.
 * COMPLETED: 요청된 매입이 완료된 상태입니다.
 * CANCEL_REQUESTED: 매입 취소가 요청된 상태입니다.
 * CANCELED: 요청된 매입 취소가 완료된 상태입니다.
 */
type AcquireStatus =
  | "READY"
  | "REQUESTED"
  | "COMPLETED"
  | "CANCEL_REQUESTED"
  | "CANCELED";

/**
 * 할부가 적용된 결제에서 할부 수수료를 부담하는 주체입니다. BUYER, CARD_COMPANY, MERCHANT 중 하나입니다.
 *
 * BUYER: 상품을 구매한 고객이 할부 수수료를 부담합니다. 일반적인 할부 결제입니다.
 * CARD_COMPANY: 카드사에서 할부 수수료를 부담합니다. 무이자 할부 결제입니다.
 * MERCHANT: 상점에서 할부 수수료를 부담합니다. 무이자 할부 결제입니다.
 */
type InterestPayer = "BUYER" | "CARD_COMPANY" | "MERCHANT";

/**
 * 카드로 결제하면 제공되는 카드 관련 정보입니다.
 *
 * amount: 카드사에 결제 요청한 금액입니다. 즉시 할인 금액(discount.amount)이 포함됩니다.
 * issuerCode: 카드 발급사 숫자 코드입니다. 카드사 코드를 참고하세요.
 * acquirerCode: 카드 매입사 숫자 코드입니다. 카드사 코드를 참고하세요.
 * number: 카드번호입니다. 번호의 일부는 마스킹 되어 있습니다. 최대 길이는 20자입니다.
 * installmentPlanMonths: 할부 개월 수입니다. 일시불이면 0입니다.
 * approveNo: 카드사 승인 번호입니다. 최대 길이는 8자입니다.
 * useCardPoint: 카드사 포인트 사용 여부입니다. 일반 카드사 포인트가 아닌, 특수한 포인트나 바우처를 사용하면 할부 개월 수가 변경되어 응답이 돌아오니 유의해주세요.
 * cardType: 카드 종류입니다.
 * ownerType: 카드의 소유자 타입입니다.
 * acquireStatus: 카드 결제의 매입 상태입니다.
 * isInterestFree: 무이자 할부의 적용 여부입니다.
 * interestPayer: 할부가 적용된 결제에서 할부 수수료를 부담하는 주체입니다.
 */
type Card = {
  amount: number;
  issuerCode: string;
  acquirerCode?: string;
  number: string;
  installmentPlanMonths: number;
  approveNo: string;
  useCardPoint: boolean;
  cardType: CardType;
  ownerType: OwnerType;
  acquireStatus: AcquireStatus;
  isInterestFree: boolean;
  interestPayer?: InterestPayer;
};

/**
 * 환불 처리 상태입니다. 아래와 같은 상태 값을 가질 수 있습니다.
 *
 * NONE: 환불 요청이 없는 상태입니다.
 * PENDING: 환불을 처리 중인 상태입니다.
 * FAILED: 환불에 실패한 상태입니다.
 * PARTIAL_FAILED: 부분 환불에 실패한 상태입니다.
 * COMPLETED: 환불이 완료된 상태입니다.
 */
type RefundStatus =
  | "NONE"
  | "PENDING"
  | "FAILED"
  | "PARTIAL_FAILED"
  | "COMPLETED";

// 정산 상태입니다. 정산이 아직 되지 않았다면 INCOMPLETED, 정산이 완료됐다면 COMPLETED 값이 들어옵니다.
type SettlementStatus = "INCOMPLETED" | "COMPLETED";

// 결제위젯 가상계좌 환불 정보 입력 기능으로 받은 고객의 환불 계좌 정보입니다. 은행 코드(bankCode), 계좌번호(accountNumber), 예금주 정보(holderName)가 담긴 객체입니다.
type RefundReceiveAccount = {
  bankCode: string;
  accountNumber: string;
  holderName: string;
};

/**
 * 가상계좌로 결제하면 제공되는 가상계좌 관련 정보입니다.
 *
 * accountType: 가상계좌 타입을 나타냅니다. 일반, 고정 중 하나입니다.
 * accountNumber: 발급된 계좌번호입니다. 최대 길이는 20자입니다.
 * bankCode: 가상계좌 은행 숫자 코드입니다. 은행 코드와 증권사 코드를 참고하세요.
 * customerName: 가상계좌를 발급한 구매자명입니다. 최대 길이는 100자입니다.
 * dueDate: 입금 기한입니다. yyyy-MM-dd'T'HH:mm:ss ISO 8601 형식을 사용합니다.
 * refundStatus: 환불 처리 상태입니다.
 * expired: 가상계좌의 만료 여부입니다.
 * settlementStatus: 정산 상태입니다.
 * refundReceiveAccount?: 결제위젯 가상계좌 환불 정보 입력 기능으로 받은 고객의 환불 계좌 정보입니다.
 */
type VirtualAccount = {
  accountType: "일반" | "고정"; // 가상계좌 타입을 나타냅니다. 일반, 고정 중 하나입니다.
  accountNumber: string; // 발급된 계좌번호입니다. 최대 길이는 20자입니다.
  bankCode: string; // 가상계좌 은행 숫자 코드입니다. 은행 코드와 증권사 코드를 참고하세요.
  customerName: string; // 가상계좌를 발급한 구매자명입니다. 최대 길이는 100자입니다.
  dueDate: string; // 입금 기한입니다. yyyy-MM-dd'T'HH:mm:ss ISO 8601 형식을 사용합니다.
  refundStatus: RefundStatus;
  expired: boolean; // 가상계좌의 만료 여부입니다.
  settlementStatus: SettlementStatus;
  refundReceiveAccount?: RefundReceiveAccount;
};

/**
 * 휴대폰으로 결제하면 제공되는 휴대폰 결제 관련 정보입니다.
 *
 * customerMobilePhone: 구매자가 결제에 사용한 휴대폰 번호입니다.
 * settlementStatus: 정산 상태입니다.
 * receiptUrl: 휴대폰 결제 내역 영수증을 확인할 수 있는 주소입니다.
 */
type MobilePhone = {
  customerMobilePhone: string;
  settlementStatus: SettlementStatus;
  receiptUrl: string;
};

/**
 * 상품권으로 결제하면 제공되는 상품권 결제 관련 정보입니다.
 *
 * approveNo: 결제 승인번호입니다. 최대 길이는 8자입니다.
 * settlementStatus: 정산 상태입니다.
 */
type GiftCertificate = {
  approveNo: string;
  settlementStatus: SettlementStatus;
};

/**
 * 계좌이체로 결제했을 때 이체 정보가 담기는 객체입니다.
 *
 * bankCode: 은행 숫자 코드입니다.
 * settlementStatus: 정산 상태입니다.
 */
type Transfer = {
  bankCode: string;
  settlementStatus: SettlementStatus;
};

/**
 * 발행된 영수증 정보입니다.
 *
 * url: 고객에게 제공할 수 있는 결제수단별 영수증입니다. 카드 결제는 매출전표, 가상계좌는 무통장 거래 명세서, 계좌이체・휴대폰・상품권 결제는 결제 거래 내역 확인서가 제공됩니다.
 */
type Receipt = {
  url: string;
};

/**
 * 결제창 정보입니다.
 *
 * url: 결제창이 열리는 주소입니다.
 */
type Checkout = {
  url: string;
};

/**
 * 간편결제 정보입니다. 고객이 선택한 결제수단에 따라 amount, discountAmount가 달라집니다. 간편결제 응답 확인 가이드를 참고하세요.
 *
 * provider: 선택한 간편결제사 코드입니다.
 * amount: 간편결제 서비스에 등록된 계좌 혹은 현금성 포인트로 결제한 금액입니다.
 * discountAmount: 간편결제 서비스의 적립 포인트나 쿠폰 등으로 즉시 할인된 금액입니다.
 */
type EasyPay = {
  provider: string;
  amount: number;
  discountAmount: number;
};

/**
 * 결제 승인에 실패하면 응답으로 받는 에러 객체입니다. 실패한 결제를 조회할 때 확인할 수 있습니다.
 *
 * code: 오류 타입을 보여주는 에러 코드입니다.
 * message: 에러 메시지입니다. 에러 발생 이유를 알려줍니다. 최대 길이는 510자입니다.
 */
type Failure = {
  code: string;
  message: string;
};

/**
 * 현금영수증 정보입니다.
 *
 * type: 현금영수증의 종류입니다. 소득공제, 지출증빙 중 하나입니다.
 * receiptKey: 현금영수증의 키 값입니다. 최대 길이는 200자입니다.
 * issuerNumber: 현금영수증 발급 번호입니다. 최대 길이는 9자입니다.
 * receiptUrl: 발행된 현금영수증을 확인할 수 있는 주소입니다.
 * amount: 현금영수증 처리된 금액입니다.
 * taxFreeAmount: 면세 처리된 금액입니다.
 */
type CashReceipt = {
  type: "소득공제" | "지출증빙" | "미발행";
  receiptKey: string;
  issuerNumber: string;
  receiptUrl: string;
  amount: number;
  taxFreeAmount: number;
};

/**
 * 현금영수증 발행 및 취소 이력이 담기는 배열입니다. 순서는 보장되지 않습니다. 예를 들어 결제 후 부분 취소가 여러 번 일어나면 모든 결제 및 부분 취소 건에 대한 현금영수증 정보를 담고 있습니다.
 * 계좌이체는 결제 즉시 현금영수증 정보를 확인할 수 있습니다. 가상계좌는 고객이 입금을 완료하면 현금영수증 정보를 확인할 수 있습니다.
 * 결제가 이미 승인된 후 현금영수증 발급 요청 API로 발급한 현금영수증은 먼저 처리된 결제 정보와 연결되지 않아 값이 null입니다. 현금영수증 조회 API로 조회해주세요.
 * 현금영수증 가맹점이라면 결제했을 때 바로 발급됩니다. 발급을 원하지 않는다면 토스페이먼츠 고객센터(1544-7772, support@tosspayments.com)로 문의해주세요.
 *
 * receiptKey: 현금영수증의 키 값입니다. 최대 길이는 200자입니다.
 * orderId: 주문번호입니다. 최소 길이는 6자, 최대 길이는 64자입니다. 주문한 결제를 식별하는 역할로, 결제를 요청할 때 가맹점에서 만들어서 사용합니다. 결제 데이터 관리를 위해 반드시 저장해야 합니다. 중복되지 않는 고유한 값을 발급해야 합니다. 결제 상태가 변해도 값이 유지됩니다.
 * orderName: 구매상품입니다. 예를 들면 생수 외 1건 같은 형식입니다. 최대 길이는 100자입니다.
 * type: 현금영수증의 종류입니다.
 * issueNumber: 현금영수증 발급 번호입니다. 최대 길이는 9자입니다.
 * receiptUrl: 발행된 현금영수증을 확인할 수 있는 주소입니다.
 * businessNumber: 현금영수증을 발급한 사업자등록번호입니다. 길이는 10자입니다.
 * transactionType: 현금영수증 발급 종류입니다. 현금영수증 발급(CONFIRM)·취소(CANCEL) 건을 구분합니다.
 * amount: 현금영수증 처리된 금액입니다.
 * taxFreeAmount: 면세 처리된 금액입니다.
 * issueStatus: 현금영수증 발급 상태입니다.
 * failure: 결제 실패 객체입니다.
 * customerIdentityNumber: 현금영수증 발급에 필요한 소비자 인증수단입니다. 현금영수증을 발급한 주체를 식별합니다. 최대 길이는 30자입니다. 현금영수증 종류에 따라 휴대폰 번호, 사업자등록번호, 현금영수증 카드 번호 등을 입력할 수 있습니다.
 * requestedAt: 현금영수증 발급 혹은 취소를 요청한 날짜와 시간 정보입니다. yyyy-MM-dd'T'HH:mm:ss±hh:mm ISO 8601 형식입니다. (e.g. 2022-01-01T00:00:00+09:00)
 */
type CashReceipts = {
  receiptKey: string;
  orderId: string;
  orderName: string;
  type: "소득공제" | "지출증빙" | "미발행";
  issueNumber: string;
  receiptUrl: string;
  businessNumber: string;
  transactionType: "CONFIRM" | "CANCEL";
  amount: number;
  taxFreeAmount: number;
  issueStatus: "IN_PROGRESS" | "COMPLETED" | "FAILED";
  failure: Failure;
  customerIdentityNumber: string;
  requestedAt: string;
};

/**
 * 카드사의 즉시 할인 프로모션 정보입니다. 즉시 할인 프로모션이 적용됐을 때만 생성됩니다.
 *
 * amount: 카드사의 즉시 할인 프로모션을 적용한 금액입니다.
 */
type Discount = {
  amount: number;
};

/**
 * 결제 처리 상태입니다. 아래와 같은 상태 값을 가질 수 있습니다. 상태 변화 흐름이 궁금하다면 흐름도를 살펴보세요.
 *
 * READY: 결제를 생성하면 가지게 되는 초기 상태입니다. 인증 전까지는 READY 상태를 유지합니다.
 * IN_PROGRESS: 결제수단 정보와 해당 결제수단의 소유자가 맞는지 인증을 마친 상태입니다. 결제 승인 API를 호출하면 결제가 완료됩니다.
 * WAITING_FOR_DEPOSIT: 가상계좌 결제 흐름에만 있는 상태로, 결제 고객이 발급된 가상계좌에 입금하는 것을 기다리고 있는 상태입니다.
 * DONE: 인증된 결제수단 정보, 고객 정보로 요청한 결제가 승인된 상태입니다.
 * CANCELED: 승인된 결제가 취소된 상태입니다.
 * PARTIAL_CANCELED: 승인된 결제가 부분 취소된 상태입니다.
 * ABORTED: 결제 승인이 실패한 상태입니다.
 * EXPIRED: 결제 유효 시간 30분이 지나 거래가 취소된 상태입니다. IN_PROGRESS 상태에서 결제 승인 API를 호출하지 않으면 EXPIRED가 됩니다.
 */
export type PaymentStatus =
  | "READY"
  | "IN_PROGRESS"
  | "WAITING_FOR_DEPOSIT"
  | "DONE"
  | "CANCELED"
  | "PARTIAL_CANCELED"
  | "ABORTED"
  | "EXPIRED";

/**
 * 결제수단입니다. 카드, 가상계좌, 간편결제, 휴대폰, 계좌이체, 문화상품권, 도서문화상품권, 게임문화상품권 중 하나입니다.
 */
type PaymentMethod =
  | "카드"
  | "가상계좌"
  | "간편결제"
  | "휴대폰"
  | "계좌이체"
  | "문화상품권"
  | "도서문화상품권"
  | "게임문화상품권";

/**
 * 결제 타입 정보입니다.
 *
 * NORMAL: 일반결제
 * BILLING: 자동결제
 * BRANDPAY: 브랜드페이
 */
type PaymentType = "NORMAL" | "BILLING" | "BRANDPAY";

/**
 * 결제 취소 이력입니다.
 *
 * cancelAmount: 결제를 취소한 금액입니다.
 * cancelReason: 결제를 취소한 이유입니다. 최대 길이는 200자입니다.
 * taxFreeAmount: 취소된 금액 중 면세 금액입니다.
 * taxExemptionAmount: 취소된 금액 중 과세 제외 금액(컵 보증금 등)입니다.
 * refundableAmount: 결제 취소 후 환불 가능한 잔액입니다.
 * easyPayDiscountAmount: 간편결제 서비스의 포인트, 쿠폰, 즉시할인과 같은 적립식 결제수단에서 취소된 금액입니다.
 * canceledAt: 결제 취소가 일어난 날짜와 시간 정보입니다. yyyy-MM-dd'T'HH:mm:ss±hh:mm ISO 8601 형식입니다.(e.g. 2022-01-01T00:00:00+09:00)
 * transactionKey: 취소 건의 키 값입니다. 여러 건의 취소 거래를 구분하는 데 사용됩니다. 최대 길이는 64자입니다.
 * receiptKey?: 취소 건의 현금영수증 키 값입니다. 최대 길이는 200자입니다.
 * cancelStatus: 취소 상태입니다. DONE이면 결제가 성공적으로 취소된 상태입니다.
 * cancelRequestid?: 취소 요청 ID입니다. 비동기 결제에만 적용되는 특수 값입니다. 일반결제, 자동결제(빌링), 페이팔 해외결제에서는 항상 null입니다.
 */
type Cancels = {
  cancelAmount: number;
  cancelReason: string;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  refundableAmount: number;
  easyPayDiscountAmount: number;
  canceledAt: string;
  transactionKey: string;
  receiptKey?: string;
  cancelStatus: string;
  cancelRequestid?: string;
};

/**
 * 결제 정보를 담고 있는 객체입니다. 결제 한 건의 결제 상태, 결제 취소 기록, 매출 전표, 현금영수증 정보 등을 자세히 알 수 있습니다.
 * 결제가 승인됐을 때 응답은 Payment 객체로 항상 동일합니다. 객체의 구성은 결제수단(카드, 가상계좌, 간편결제 등)에 따라 조금씩 달라집니다.
 */
export interface Payment {
  version: string;
  paymentKey: string;
  type: PaymentType;
  orderId: string;
  orderName: string;
  mId: string;
  currency: string;
  method: PaymentMethod;
  totalAmount: number;
  balanceAmount: number;
  status: PaymentStatus;
  requestedAt: string;
  approvedAt: string;
  useEscrow: boolean;
  lastTransactionKey?: string;
  suppliedAmount: number;
  vat: number;
  cultureExpense: boolean;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  cancels?: Cancels;
  isPartialCancelable: boolean;
  card?: Card;
  virtualAccount?: VirtualAccount;
  secret?: string;
  mobilePhone?: MobilePhone;
  giftCertificate?: GiftCertificate;
  transfer?: Transfer;
  receipt?: Receipt;
  checkout?: Checkout;
  easyPay?: EasyPay;
  country: string;
  failure?: Failure;
  cashReceipt?: CashReceipt;
  cashReceipts?: CashReceipts[];
  discount?: Discount;
}

export interface PaymentWithVirtualAccount extends Payment {
  virtualAccount: VirtualAccount;
}

export interface PaymentWithCard extends Payment {
  card: Card;
}
