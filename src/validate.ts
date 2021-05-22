import { strictEqual } from "assert";

import { PaymentRequest } from "./collections";
import {
  Environment,
  GlobalConfig,
  UserConfig
} from "./common";
import { TransferRequest } from "./disbursements";

export function validateRequestToPay(
  paymentRequest: PaymentRequest
): Promise<void> {
  const { amount}: PaymentRequest = paymentRequest || {};
  return Promise.resolve().then(() => {
    strictEqual(isTruthy(amount), true, "amount is required");
    strictEqual(isNumeric(amount), true, "amount must be a number");
  });
}

export function validateTransfer(
  payoutRequest: TransferRequest
): Promise<void> {
  const { amount }: TransferRequest = payoutRequest || {};
  return Promise.resolve().then(() => {
    strictEqual(isTruthy(amount), true, "amount is required");
    strictEqual(isNumeric(amount), true, "amount must be a number");
  });
}

export function validateGlobalConfig(config: GlobalConfig): void {
  const { baseUrl, environment } = config;

  if (environment && environment !== Environment.SANDBOX) {
    strictEqual(
      isTruthy(baseUrl),
      true,
      "baseUrl is required if environment is not sandbox"
    );
    strictEqual(isString(baseUrl), true, "baseUrl must be a string");
  }
}


export function validateUserConfig({ apiKey, apiSecret }: UserConfig): void {
  strictEqual(isTruthy(apiKey), true, "apiKey is required");
  strictEqual(isString(apiKey), true, "apiKey must be a string");

  strictEqual(isTruthy(apiSecret), true, "apiSecret is required");
  strictEqual(isString(apiSecret), true, "apiSecret must be a string");
}

function isNumeric(value: any): boolean {
  return !isNaN(parseInt(value, 10));
}

function isTruthy(value: any): boolean {
  return !!value;
}

function isString(value: any): boolean {
  return typeof value === "string";
}

function _isUuid4(value: string): boolean {
  return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
    value
  );
}
