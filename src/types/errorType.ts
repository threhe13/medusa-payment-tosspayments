export type TossPaymentsErrorType<ErrorCodeList = string> = {
  code: ErrorCodeList;
  message: string;
};

export type PaymentConfirmErrorCode =
  | "ALREADY_PROCESSED_PAYMENT"
  | "PROVIDER_ERROR"
  | "EXCEED_MAX_CARD_INSTALLMENT_PLAN"
  | "INVALID_REQUEST"
  | "NOT_ALLOWED_POINT_USE"
  | "INVALID_API_KEY"
  | "INVALID_REJECT_CARD"
  | "BELOW_MINIMUM_AMOUNT"
  | "INVALID_CARD_EXPIRATION"
  | "INVALID_STOPPED_CARD"
  | "EXCEED_MAX_DAILY_PAYMENT_COUNT"
  | "NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT"
  | "INVALID_CARD_INSTALLMENT_PLAN"
  | "NOT_SUPPORTED_MONTHLY_INSTALLMENT_PLAN"
  | "EXCEED_MAX_PAYMENT_AMOUNT"
  | "NOT_FOUND_TERMINAL_ID"
  | "INVALID_AUTHORIZE_AUTH"
  | "INVALID_CARD_LOST_OR_STOLEN"
  | "RESTRICTED_TRANSFER_ACCOUNT"
  | "INVALID_CARD_NUMBER"
  | "INVALID_UNREGISTERED_SUBMALL"
  | "NOT_REGISTERED_BUSINESS"
  | "EXCEED_MAX_ONE_DAY_WITHDRAW_AMOUNT"
  | "EXCEED_MAX_ONE_TIME_WITHDRAW_AMOUNT"
  | "CARD_PROCESSING_ERROR"
  | "EXCEED_MAX_AMOUNT"
  | "INVALID_ACCOUNT_INFO_RE_REGISTER"
  | "NOT_AVAILABLE_PAYMENT"
  | "UNAPPROVED_ORDER_ID"
  | "EXCEED_MAX_MONTHLY_PAYMENT_AMOUNT"
  | "UNAUTHORIZED_KEY"
  | "REJECT_ACCOUNT_PAYMENT"
  | "REJECT_CARD_PAYMENT"
  | "REJECT_CARD_COMPANY"
  | "FORBIDDEN_REQUEST"
  | "REJECT_TOSSPAY_INVALID_ACCOUNT"
  | "EXCEED_MAX_AUTH_COUNT"
  | "EXCEED_MAX_ONE_DAY_AMOUNT"
  | "NOT_AVAILABLE_BANK"
  | "INVALID_PASSWORD"
  | "INCORRECT_BASIC_AUTH_FORMAT"
  | "FDS_ERROR"
  | "NOT_FOUND_PAYMENT"
  | "NOT_FOUND_PAYMENT_SESSION"
  | "FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING"
  | "FAILED_INTERNAL_SYSTEM_PROCESSING"
  | "UNKNOWN_PAYMENT_ERROR";

export type PaymentInquiryErrorCode =
  | "NOT_SUPPORTED_MONTHLY_INSTALLMENT_PLAN_BELOW_AMOUNT"
  | "UNAUTHORIZED_KEY"
  | "FORBIDDEN_CONSECUTIVE_REQUEST"
  | "INCORRECT_BASIC_AUTH_FORMAT"
  | "NOT_FOUND_PAYMENT"
  | "NOT_FOUND"
  | "FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING";

export type PaymentCancelErrorCode =
  | "ALREADY_CANCELED_PAYMENT"
  | "INVALID_REFUND_ACCOUNT_INFO"
  | "EXCEED_CANCEL_AMOUNT_DISCOUNT_AMOUNT"
  | "INVALID_REQUEST"
  | "INVALID_REFUND_ACCOUNT_NUMBER"
  | "INVALID_BANK"
  | "NOT_MATCHES_REFUNDABLE_AMOUNT"
  | "PROVIDER_ERROR"
  | "REFUND_REJECTED"
  | "REFUND_REJECTED"
  | "UNAUTHORIZED_KEY"
  | "NOT_CANCELABLE_AMOUNT"
  | "FORBIDDEN_CONSECUTIVE_REQUEST"
  | "FORBIDDEN_REQUEST"
  | "NOT_CANCELABLE_PAYMENT"
  | "EXCEED_MAX_REFUND_DUE"
  | "NOT_ALLOWED_PARTIAL_REFUND_WAITING_DEPOSIT"
  | "NOT_ALLOWED_PARTIAL_REFUND"
  | "NOT_AVAILABLE_BANK"
  | "INCORRECT_BASIC_AUTH_FORMAT"
  | "NOT_CANCELABLE_PAYMENT_FOR_DORMANT_USER"
  | "NOT_FOUND_PAYMENT"
  | "FAILED_INTERNAL_SYSTEM_PROCESSING"
  | "FAILED_REFUND_PROCESS"
  | "FAILED_METHOD_HANDLING_CANCEL"
  | "FAILED_PARTIAL_REFUND"
  | "COMMON_ERROR"
  | "FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING";
