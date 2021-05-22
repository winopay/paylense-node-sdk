import { AssertionError } from "assert";

import * as paylense from "../src";

import { expect } from "./chai";

const defaultGlobalConfig: paylense.GlobalConfig = {
  baseUrl: "https://api-sandbox.paylense.com",
  environment: paylense.Environment.SANDBOX,
  version: "v1"
};

const userConfig: paylense.UserConfig = {
  apiKey: "11011",
  apiSecret: "sdk@2020"
};

describe("PaylenseClient", function() {
  describe("#create", function() {
    context("when there is no app id", function() {
      it("throws an error", function() {
        expect(paylense.create.bind({})).to.throw(AssertionError);
      });
    });

    context("when there is a app id", function() {
      it("throws doesn't throw  an error", function() {
        expect(
          paylense.create.bind({ defaultGlobalConfig, userConfig })
        ).to.not.throw();
      });

      it("returns a creator for Collections client", function() {
        expect(paylense.create(defaultGlobalConfig, userConfig))
          .to.have.property("Collections")
          .that.is.a("function");
      });

      it("returns a creator for Disbursements client", function() {
        expect(paylense.create(defaultGlobalConfig, userConfig))
          .to.have.property("Disbursements")
          .that.is.a("function");
      });
    });
  });
});
