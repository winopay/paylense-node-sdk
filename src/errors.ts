import { AxiosError } from "axios";
import { FailureReason } from "./common";
import { Payment } from "./collections";
import { Transfer } from "./disbursements";

interface ErrorBody {
  code: FailureReason;
  message: string;
}

export class PaylenseError extends Error {
  public transaction?: Payment | Transfer;

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InternalProcessingError extends PaylenseError {
  public name = "InternalProcessingError";
}

export class NotAllowedTargetEnvironmentError extends PaylenseError {
  public name = "NotAllowedTargetEnvironmentError";
}

export class NotAllowedError extends PaylenseError {
  public name = "NotAllowedError";
}

export class ResourceAlreadyExistError extends PaylenseError {
  public name = "ResourceAlreadyExistError";
}

export class ResourceNotFoundError extends PaylenseError {
  public name = "ResourceNotFoundError";
}

export class ServiceUnavailableError extends PaylenseError {
  public name = "ServiceUnavailableError";
}

export class TransactionCancelledError extends PaylenseError {
  public name = "TransactionCancelledError";
}

export class UnspecifiedError extends PaylenseError {
  public name = "UnspecifiedError";
}

export function handleError(error: AxiosError): Error {
  if (!error.response) {
    return error;
  }

  const { code, message }: ErrorBody = error.response.data || {};

  return getError(code, message);
}

export function getError(code?: FailureReason, message?: string) {

  if (code === FailureReason.INTERNAL_PROCESSING_ERROR) {
    return new InternalProcessingError(message);
  }

  if (code === FailureReason.NOT_ALLOWED) {
    return new NotAllowedError(message);
  }

  if (code === FailureReason.NOT_ALLOWED_TARGET_ENVIRONMENT) {
    return new NotAllowedTargetEnvironmentError(message);
  }

  if (code === FailureReason.RESOURCE_ALREADY_EXIST) {
    return new ResourceAlreadyExistError(message);
  }

  if (code === FailureReason.RESOURCE_NOT_FOUND) {
    return new ResourceNotFoundError(message);
  }

  if (code === FailureReason.SERVICE_UNAVAILABLE) {
    return new ServiceUnavailableError(message);
  }

  return new UnspecifiedError();
}

export function getTransactionError(transaction: Payment | Transfer) {
  const error: PaylenseError = getError(transaction.reason as FailureReason);
  error.transaction = transaction;

  return error;
}
