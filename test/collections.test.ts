import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from "chai";

import Collections from "../src/collections";

import { createMock } from "./mock";

import { PaymentRequest } from "../src/collections";

describe("Collections", function() {
  let collections: Collections;
  let mockAdapter: MockAdapter;
  let mockClient: AxiosInstance;

  beforeEach(() => {
    [mockClient, mockAdapter] = createMock();
    collections = new Collections(mockClient);
  });

  describe("requestToPay", function() {
    context("when the amount is missing", function() {
      it("throws an error", function() {
        const request = {} as PaymentRequest;
        return expect(collections.requestToPay(request)).to.be.rejectedWith(
          "amount is required"
        );
      });
    });

    context("when the amount is not numeric", function() {
      it("throws an error", function() {
        const request = { amount: "alphabetic" } as PaymentRequest;
        return expect(collections.requestToPay(request)).to.be.rejectedWith(
          "amount must be a number"
        );
      });
    });

    it("makes the correct request", function() {
      const request: PaymentRequest = {
        amount: "50",
        merchant_reference: "123456",
        account_number: "256774290781",
        narration: "testing"
      };
      return expect(
        collections.requestToPay({ ...request })
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.post).to.have.lengthOf(1);
        expect(mockAdapter.history.post[0].url).to.eq(
          "/collections"
        );
        expect(mockAdapter.history.post[0].data).to.eq(JSON.stringify(request));
        expect(mockAdapter.history.post[0].headers["apiKey"]).to.be.a(
          "string"
        );
      });
    });
  });

  describe("getTransaction", function() {
    it("makes the correct request", function() {
      return expect(
        collections.getTransaction("reference")
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/collections/reference"
        );
      });
    });
  });
});
