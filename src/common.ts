export type Config = GlobalConfig & UserConfig;

export interface GlobalConfig {
  /**
   * The base URL of the EWP system where the transaction shall be processed.
   * This parameter is used to route the request to the EWP system that will
   * initiate the transaction.
   */
  baseUrl?: string;

  version: string;

  /**
   * The identifier of the EWP system where the transaction shall be processed.
   * This parameter is used to route the request to the EWP system that will
   * initiate the transaction.
   */
  environment: Environment;
}

export interface UserConfig {
   /**
   * Subscription key which provides access to this API. Found in your Profile
   */
  apiKey: string;
  /**
   * The API user's key
   */
  apiSecret: string;
}

export enum Environment {
  SANDBOX = "sandbox",
  PRODUCTION = "production"
}

export enum TransactionStatus {
  SUCCESSFUL = "SUCCESSFUL",
  PENDING = "PENDING",
  FAILED = "FAILED"
}

export enum FailureReason {
  PAYEE_NOT_FOUND = "PAYEE_NOT_FOUND",
  PAYER_NOT_FOUND = "PAYER_NOT_FOUND",
  NOT_ALLOWED = "NOT_ALLOWED",
  NOT_ALLOWED_TARGET_ENVIRONMENT = "NOT_ALLOWED_TARGET_ENVIRONMENT",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  INTERNAL_PROCESSING_ERROR = "INTERNAL_PROCESSING_ERROR",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXIST = "RESOURCE_ALREADY_EXIST"
}
