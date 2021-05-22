# Paylense API NodeJS Client</h1>

<strong>Power your ECMA apps Paylense API</strong>

<div>
  Join our active, engaged community: <br>
  <a href="https://spectrum.chat/paylense-api-sdk/">Spectrum</a>
  <br><br>
</div>


[![Build Status](https://travis-ci.org/winopay/paylense-node-sdk.svg?branch=master)](https://travis-ci.org/winopay/paylense-node-sdk)

[![npm package](https://img.shields.io/npm/v/paylense-sdk/latest.svg?style=flat-square)](https://www.npmjs.com/package/paylense-sdk)
[![npm downloads](https://img.shields.io/npm/dt/paylense-sdk.svg?style=flat-square)](https://www.npmjs.com/package/paylense-sdk)
[![GitHub issues](https://img.shields.io/github/issues/winopay/paylense-node-sdk.svg?style=flat-square)](https://github.com/winopay/paylense-node-sdk)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/paylense-sdk.svg?style=flat-square)](https://www.npmjs.com/package/paylense-sdk)
![GitHub](https://img.shields.io/github/license/winopay/paylense-node-sdk.svg?style=flat-square)
[![Dependency Status](https://david-dm.org/winopay/paylense-node-sdk.svg)](https://david-dm.org/winopay/paylense-node-sdk)
[![Dev Dependency Status](https://david-dm.org/winopay/paylense-node-sdk.svg#info=devDependencies)](https://david-dm.org/winopay/paylense-node-sdk#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/winopay/paylense-node-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/winopay/paylense-node-sdk?targetFile=package.json)
[![Coverage Status](https://coveralls.io/repos/github/winopay/paylense-node-sdk/badge.svg?branch=master)](https://coveralls.io/github/winopay/paylense-node-sdk?branch=master)
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/paylense-api-sdk/)


## Usage

### Installation

Add the library to your project

```sh
npm install paylense-sdk --save-dev
```

## User Credentials

You get the `api_key` and `api_secret` from `https://dashboard.paylense.com/signup`.

The credentials for the sandbox environment can be used straight away. In production, the credentials are provided for you after KYC requirements are met.

## Configuration

Before we can fully utilize the library, we need to specify global configurations. The global configuration must contain the following:

- `environment`: Optional environment, either "sandbox" or "production". Default is 'sandbox'
- `version`: The API version being accessed. This is mandatory.

As an example, you might configure the library like this:

```js
const paylense = require("paylense-sdk");

const defaultGlobalConfig: paylense.GlobalConfig = {
  environment: paylense.Environment.SANDBOX,
  version: "v1"
};

const userConfig: paylense.UserConfig = {
  api_key: "11011",
  api_secret: "sdk@2020"
};

const { Collections, Disbursements } = paylense.create(defaultGlobalConfig, userConfig);
```

## Collections

Used for receiving money

You can create a collections client with the following:

```js
const collections = Collections();
```

#### Methods

1. `requestToPay(request: PaymentRequest): Promise<string>`: This operation is used to request a payment from a consumer (Payer). The payer will be asked to authorize the payment. The transaction is executed once the payer has authorized the payment. The transaction will be in status PENDING until it is authorized or declined by the payer or it is timed out by the system. Status of the transaction can be validated by using `getTransaction`

2. `getTransaction(transactionId: string): Promise<Payment>`: Retrieve transaction information using the `transactionId` returned by `requestToPay`. You can invoke it at intervals until the transaction fails or succeeds. If the transaction has failed, it will throw an appropriate error. The error will be a subclass of `PaylenseError`. Check [`src/error.ts`](https://github.com/winopay/paylense-node-sdk/blob/master/src/errors.ts) for the various errors that can be thrown

#### Sample Code

```js
const paylense = require("paylense-sdk");

const defaultGlobalConfig: paylense.GlobalConfig = {
  environment: paylense.Environment.SANDBOX,
  version: "v1"
};

const userConfig: paylense.UserConfig = {
  api_key: "11011",
  api_secret: "sdk@2020"
};

const { Collections } = paylense.create(defaultGlobalConfig, userConfig);

const collections = Collections();

// Request to pay
collections
  .requestToPay({
    amount: "50",
    merchant_reference: "123456",
    account_number: "256774290781",
    narration: "testing"
  })
  .then(transactionId => {
    console.log({ transactionId });

    // Get transaction status
    return collections.getTransaction(transactionId);
  })
  .then(transaction => {
    console.log({ transaction });
  })
  .catch(error => {
    console.log(error);
  });
```

## Disbursements

Used for sending money to users

You can create a disbursements client with the following

```js
const disbursements = Disbursements();
```

#### Methods

1. `transfer(request: TransferRequest): Promise<string>`

Used to transfer an amount from the owner’s account to a payee account. It returns a transaction id which can use to check the transaction status with the `getTransaction` function

2. `getTransaction(transactionId: string): Promise<Transfer>`: Retrieve transaction information using the `transactionId` returned by `transfer`. You can invoke it at intervals until the transaction fails or succeeds. If the transaction has failed, it will throw an appropriate error. The error will be a subclass of `PaylenseError`. Check [`src/error.ts`](https://github.com/winopay/paylense-node-sdk/blob/master/src/errors.ts) for the various errors that can be thrown

#### Sample Code

```js
const paylense = require("paylense-sdk");

const defaultGlobalConfig: paylense.GlobalConfig = {
  environment: paylense.Environment.SANDBOX,
  version: "v1"
};

const userConfig: paylense.UserConfig = {
  api_key: "11011",
  api_secret: "sdk",
  password: "sdk@2020"
};
// initialise paylense library
const { Disbursements } = paylense.create(defaultGlobalConfig, userConfig);

// initialise disbursements
const disbursements = Disbursements();

// Transfer
disbursements
  .transfer({
    amount: "50",
    merchant_reference: "123456",
    account_number: "256774290781",
    narration: "testing"
  })
  .then(transactionId => {
    console.log({ transactionId });

    // Get transaction status
    return disbursements.getTransaction(transactionId);
  })
  .then(transaction => {
    console.log({ transaction });
  })
  .catch(error => {
    console.log(error);
  });
```
