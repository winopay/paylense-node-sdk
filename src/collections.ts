import { AxiosInstance } from "axios";
import uuid from "uuid/v4";

import { getTransactionError } from "./errors";
import { validateRequestToPay } from "./validate";

import { FailureReason, TransactionStatus } from "./common";

export interface PaymentRequest {
  /**
   * Amount that will be debited from the account_number account
   */
  amount: string;

  /**
   * External id is used as a reference to the transaction.
   * External id is used for reconciliation.
   * The external id will be included in transaction history report.
   * External id is not required to be unique.
   */
  merchant_reference: string;

  /**
   * Party identifies a account holder in the wallet platform.
   * Party consists of two parameters, type and partyId.
   * Each type have its own validation of the partyId
   *   - MSISDN - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   *   - EMAIL - Validated to be a valid e-mail format. Validated with IsEmail
   *   - PARTY_CODE - UUID of the party. Validated with IsUuid
   */
  account_number: string;

  /**
   * Message that will be written in the account_number transaction history message field.
   */
  narration?: string;

}

export interface Payment {
  /**
   * External id provided in the creation of the requestToPay transaction
   */
  merchant_reference: string;

  /**
   * Amount that will be debited from the account_number account.
   */
  amount: string;

  /**
   * Party identifies a account holder in the wallet platform.
   * Party consists of two parameters, type and partyId.
   * Each type have its own validation of the partyId
   *   - MSISDN - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   *   - EMAIL - Validated to be a valid e-mail format. Validated with IsEmail
   *   - PARTY_CODE - UUID of the party. Validated with IsUuid
   */
  account_number: string;

  /**
   * Message that will be written in the account_number transaction history message field.
   */
  narration: string;

  reason?: FailureReason;

  status: TransactionStatus;
}

export default class Collections {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * This method is used to request a payment from a consumer (Payer).
   * The account_number will be asked to authorize the payment. The transaction will
   * be executed once the account_number has authorized the payment.
   * The requesttopay will be in status PENDING until the transaction
   * is authorized or declined by the account_number or it is timed out by the system.
   * Status of the transaction can be validated by using `getTransation`
   *
   * @param paymentRequest
   */
  public requestToPay({
    ...paymentRequest
  }: PaymentRequest): Promise<string> {
    return validateRequestToPay(paymentRequest).then(() => {
      const referenceId: string = uuid();
      return this.client
        .post<void>("/collections", paymentRequest)
        .then(() => referenceId);
    });
  }

  /**
   * This method is used to retrieve transaction information. You can invoke it
   * at intervals until your transaction fails or succeeds.
   *
   * If the transaction has failed, it will throw an appropriate error. The error will be a subclass
   * of `PaylenseError`. Check [`src/error.ts`](https://github.com/winopay/paylense-node-sdk/blob/master/src/errors.ts)
   * for the various errors that can be thrown
   *
   * @param referenceId the value returned from `requestToPay`
   */
  public getTransaction(referenceId: string): Promise<Payment> {
    return this.client
      .get<Payment>(`/collections/${referenceId}`)
      .then(response => response.data)
      .then(transaction => {
        if (transaction.status === TransactionStatus.FAILED) {
          return Promise.reject(getTransactionError(transaction));
        }

        return Promise.resolve(transaction);
      });
  }
}
