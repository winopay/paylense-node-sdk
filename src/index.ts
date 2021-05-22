export { Payment, PaymentRequest } from "./collections";
export { Transfer, TransferRequest } from "./disbursements";
export * from "./errors";
export {
  TransactionStatus as Status,
  Environment,
  FailureReason,
  GlobalConfig,
  UserConfig
} from "./common";

import { AxiosInstance } from "axios";

import Collections from "./collections";
import Disbursements from "./disbursements";

import { createClient } from "./client";

import {
  validateGlobalConfig,
  validateUserConfig
} from "./validate";

import {
  Config,
  Environment,
  GlobalConfig,
  UserConfig
} from "./common";

export interface PaylenseClient {
  Collections(): Collections;
  Disbursements(): Disbursements;
}

// const defaultGlobalConfig: GlobalConfig = {
//   baseUrl: "https://api-sandbox.paylense.com",
//   environment: Environment.SANDBOX
// };

// const userConfig: UserConfig = {
//   apiKey: "11011",
//   apiSecret: "sdk@2020",
// };

/**
 * Initialise the library
 *
 * @param globalConfig Global configuration required to use in making requestests
 * @param userConfig configuration required to use in authentication
 */
export function create(globalConfig: GlobalConfig, userConfig: UserConfig): PaylenseClient {
  validateGlobalConfig(globalConfig);
  validateUserConfig(userConfig);
  const baseUrl = Environment.SANDBOX ? `https://api-sandbox.paylense.com/api/${globalConfig.version}`
                                      : `https://api.paylense.com/api/${globalConfig.version}`;
  const modifiedGlobalConfig: GlobalConfig = {
    ...globalConfig,
    baseUrl
  };

  return {
    Collections(): Collections {
      const client: AxiosInstance = createClient({
        ...modifiedGlobalConfig,
        ...userConfig });

      return new Collections(client);
    },

    Disbursements(): Disbursements {

      const client: AxiosInstance = createClient({
        ...globalConfig,
        ...userConfig});

      return new Disbursements(client);
    }
  };
}
