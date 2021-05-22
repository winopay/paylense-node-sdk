import { AxiosInstance } from "axios";
import uuid from "uuid/v4";

import { getTransactionError } from "./errors";
import { validateTransfer } from "./validate";

import { FailureReason, TransactionStatus } from "./common";

export interface TransferRequest {
  /**
   * Amount that will be debited from the payer account.
   */
  amount: string;

  /**
   * External id is used as a reference to the transaction.
   * External id is used for reconciliation.
   * The external id will be included in transaction history report.
   * External id is not required to be unique.
   */
  merchant_reference?: string;

  /**
   * Party identifies a account holder in the wallet platform.
   * Party consists of two parameters, type and partyId.
   * Each type have its own validation of the partyId
   *   MSISDN - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   *   EMAIL - Validated to be a valid e-mail format. Validated with IsEmail
   *   PARTY_CODE - UUID of the party. Validated with IsUuid
   */
  account_number: string;

  /**
   * Message that will be written in the payer transaction history message field.
   */
  narration?: string;
}

export interface Transfer {
  /**
   * Amount that will be debited from the payer account.
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
   *   MSISDN - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   *   EMAIL - Validated to be a valid e-mail format. Validated with IsEmail
   *   PARTY_CODE - UUID of the party. Validated with IsUuid
   */
  account_number: string;
  status: TransactionStatus;
  reason?: FailureReason;
}

export default class Disbursements {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Transfer operation is used to transfer an amount from the owner’s
   * account to a payee account.
   * Status of the transaction can be validated by using the
   *
   * @param paymentRequest
   */
  public transfer({
    ...payoutRequest
  }: TransferRequest): Promise<string> {
    return validateTransfer(payoutRequest).then(() => {
      const referenceId: string = uuid();
      return this.client
        .post<void>("/disbursements", payoutRequest)
        .then(() => referenceId);
    });
  }

  /**
   * This method is used to retrieve the transaction. You can invoke this method
   * to at intervals until your transaction fails or succeeds.
   *
   * If the transaction has failed, it will throw an appropriate error. The error will be a subclass
   * of `PaylenseError`. Check [`src/error.ts`](https://github.com/winopay/paylense-node-sdk/blob/master/src/errors.ts)
   * for the various errors that can be thrown
   *
   * @param referenceId the value returned from `transfer`
   */
  public getTransaction(referenceId: string): Promise<Transfer> {
    return this.client
      .get<Transfer>(`/collections/${referenceId}`)
      .then(response => response.data)
      .then(transaction => {
        if (transaction.status === TransactionStatus.FAILED) {
          return Promise.reject(getTransactionError(transaction));
        }

        return Promise.resolve(transaction);
      });
  }
}
