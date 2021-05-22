import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import { Payment } from "../src/collections";
import { Transfer } from "../src/disbursements";

export function createMock(): [AxiosInstance, MockAdapter] {
  const client = axios.create({
    headers: {
      "Content-Type": "application/json"
    }
  });

  const mock = new MockAdapter(client);

  mock.onGet("/test").reply(200);

  mock.onPost("/collections").reply(201);

  mock.onGet(/\/collections\/[\w\-]+/).reply(200, {
    merchant_reference: "string",
    amount: "2000",
    account_number: "256772000000",
    narration: "test",
    status: "SUCCESSFUL"
  } as Payment);

  mock.onPost("/disbursements").reply(201);

  mock.onGet(/\/disbursements\/[\w\-]+/).reply(200, {
    merchant_reference: "string",
    amount: "2000",
    account_number: "256772000000",
    narration: "test",
    status: "SUCCESSFUL"
  } as Transfer);

  return [client, mock];
}
