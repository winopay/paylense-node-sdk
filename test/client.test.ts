// import sinon from "sinon";

import { createClient } from "../src/client";
import { expect } from "./chai";
import { createMock } from "./mock";

import { Config, Environment } from "../src/common";

describe("Client", function() {
  const config: Config = {
    environment: Environment.SANDBOX,
    version: "v1",
    apiKey: "11011",
    apiSecret: "sdk",
    password: "sdk@2020"
  };

  describe("createClient", function() {
    it("creates an axios instance with the right default headers", function() {
      const [mockClient] = createMock();
      const client = createClient(config, mockClient);
      expect(client.defaults.headers).to.have.deep.property("apiKey");
    });

    it("makes requests with the right headers", function() {
      const [mockClient, mockAdapter] = createMock();
      const client = createClient(config, mockClient);
      return expect(client.get("/test")).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get[0].headers).to.have.deep.property("apiKey");
      });
    });
  });

  describe("creatClient", function() {
    // it("makes requests with the right headers", function() {
    //   const [mockClient, mockAdapter] = createMock();
    //   const refresher = sinon.fake.resolves("token");
    //   const client = createClient(client: mockClient);
    //   return expect(client.get("/test")).to.be.fulfilled.then(() => {
    //     expect(mockAdapter.history.get[0].headers).to.have.deep.property(
    //       "Authorization",
    //       "Bearer token"
    //     );
    //     expect(refresher.callCount).to.eq(1);
    //   });
    // });
  });
});
