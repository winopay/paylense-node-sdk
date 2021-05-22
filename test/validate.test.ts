import { AssertionError } from "assert";
import uuid from "uuid/v4";

import { PaymentRequest } from "../src/collections";
import { expect } from "./chai";

import { Environment, GlobalConfig, UserConfig } from "../src/common";
import { TransferRequest } from "../src/disbursements";
import {
  validateGlobalConfig,
  validateRequestToPay,
  validateTransfer,
  validateUserConfig
} from "../src/validate";

describe("Validate", function() {
  describe("validateGlobalConfig", function() {
    context("when callbackHost is not specified", function() {
      it("throws an error", function() {
        expect(validateGlobalConfig.bind(null, {})).to.throw(
          AssertionError,
          "callbackHost is required"
        );
      });
    });

    context("when callbackHost is specified", function() {
      it("doesn't throw", function() {
        expect(
          validateGlobalConfig.bind(null, { callbackHost: "example.com" })
        ).to.not.throw();
      });
    });

    context("when environment is specified", function() {
      context("and is not sandbox", function() {
        context("and baseUrl is not specified", function() {
          it("throws", function() {
            expect(
              validateGlobalConfig.bind(null, {
                callbackHost: "example.com",
                environment: Environment.PRODUCTION
              })
            ).to.throw(
              AssertionError,
              "baseUrl is required if environment is not sandbox"
            );
          });
        });

        context("and baseUrl is specified", function() {
          it("doesn't throw", function() {
            expect(
              validateGlobalConfig.bind(null, {
                callbackHost: "example.com",
                environment: Environment.PRODUCTION,
                baseUrl: "paylense production base url"
              })
            ).to.not.throw();
          });
        });
      });
    });
  });

  describe("validateUserConfig", function() {
    context("when app id is not specified", function() {
      it("throws an error", function() {
        expect(validateUserConfig.bind(null, {} as UserConfig)).to.throw(
          AssertionError,
          "apiKey is required"
        );
      });
    });

    context("when apiSecret is not specified", function() {
      it("throws an error", function() {
        expect(
          validateUserConfig.bind(null, {
            apiKey: "11011"
          } as UserConfig)
        ).to.throw(AssertionError, "apiSecret is required");
      });
    });

    context("when password is not specified", function() {
      it("throws an error", function() {
        expect(
          validateUserConfig.bind(null, {
            apiKey: "11011",
            apiSecret: "sdk"
          } as UserConfig)
        ).to.throw(AssertionError, "password is required");
      });
    });

    context("when the config is valid", function() {
      it("throws an error", function() {
        expect(
          validateUserConfig.bind(null, {
            apiKey: "11011",
            apiSecret: "sdk",
            password: "sdk@2020"
          })
        ).to.not.throw();
      });
    });
  });

  describe("validateRequestToPay", function() {
    context("when the processing numer is missing", function() {
      it("throws an error", function() {
        const request = {
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "processing number is required"
        );
      });
    });

    context("when the amount is missing", function() {
      it("throws an error", function() {
        const request = {
          merchant_reference: "1212121212"
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "amount is required"
        );
      });
    });

    context("when the amount is not numeric", function() {
      it("throws an error", function() {
        const request = {
          merchant_reference: "1212121212",
          amount: "alphabetic"
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "amount must be a number"
        );
      });
    });

    context("when the phone numer is missing", function() {
      it("throws an error", function() {
        const request = {
          merchant_reference: "1212121212",
          amount: "1000",
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "phone number is required"
        );
      });
    });

    context("when the request is valid", function() {
      it("fulfills", function() {
        const request = {
          merchant_reference: "1212121212",
          amount: "1000",
          account_number: "07519782662"
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.fulfilled;
      });
    });
  });

  describe("validateTransfer", function() {
    context("when the processing number is missing", function() {
      it("throws an error", function() {
        const request = {} as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "processing number is required"
        );
      });
    });

    context("when the amount is missing", function() {
      it("throws an error", function() {
        const request = {
          merchant_reference: "1212121212",
        } as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "amount is required"
        );
      });
    });

    context("when the amount is not numeric", function() {
      it("throws an error", function() {
        const request = {
          amount: "alphabetic",
          merchant_reference: "1212121212",
        } as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "amount must be a number"
        );
      });
    });

    context("when the phone number is missing", function() {
      it("throws an error", function() {
        const request = {
          merchant_reference: "1212121212",
          amount: "1000"
        } as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "phone number is required"
        );
      });
    });

    context("when the request is valid", function() {
      it("fulfills", function() {
        const request = {
          merchant_reference: "1212121212",
          amount: "1000",
          account_number: "0774565565"
        } as TransferRequest;
        return expect(validateTransfer(request)).to.be.fulfilled;
      });
    });
  });
});
