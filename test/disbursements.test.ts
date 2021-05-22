import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from "chai";

import Disbursements from "../src/disbursements";

import { createMock } from "./mock";

import { TransferRequest } from "../src/disbursements";

describe("Disbursements", function() {
  let disbursements: Disbursements;
  let mockAdapter: MockAdapter;
  let mockClient: AxiosInstance;

  beforeEach(() => {
    [mockClient, mockAdapter] = createMock();
    disbursements = new Disbursements(mockClient);
  });

  describe("transfer", function() {
    context("when the amount is missing", function() {
      it("throws an error", function() {
        const request = {} as TransferRequest;
        return expect(disbursements.transfer(request)).to.be.rejectedWith(
          "amount is required"
        );
      });
    });

    context("when the amount is not numeric", function() {
      it("throws an error", function() {
        const request = { amount: "alphabetic" } as TransferRequest;
        return expect(disbursements.transfer(request)).to.be.rejectedWith(
          "amount must be a number"
        );
      });
    });

    it("makes the correct request", function() {
      const request: TransferRequest = {
        amount: "50",
        merchant_reference: "123456",
        account_number: "256774290781",
        narration: "testing"
      };
      return expect(
        disbursements.transfer({ ...request })
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.post).to.have.lengthOf(1);
        expect(mockAdapter.history.post[0].url).to.eq(
          "/disbursements"
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
        disbursements.getTransaction("reference")
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/disbursements/reference"
        );
      });
    });
  });
});
