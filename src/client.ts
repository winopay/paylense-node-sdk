import axios, { AxiosInstance } from "axios";

import { handleError } from "./errors";

import { GlobalConfig, UserConfig } from "./common";

export function createClient(
  config: UserConfig & GlobalConfig,
  client: AxiosInstance = axios.create()): AxiosInstance {

  const basicAuthToken: string = Buffer.from(`${config.apiSecret}`)
                                       .toString("base64");

  client.defaults.headers = {
    "Content-Type": "application/json",
    "Authorization": `Basic ${basicAuthToken}`,
    "Secret-Key": config.apiSecret
  };

  return withErrorHandling(client);
}

export function withErrorHandling(client: AxiosInstance): AxiosInstance {
  client.interceptors.response.use(
    response => response,
    error => Promise.reject(handleError(error))
  );

  return client;
}
