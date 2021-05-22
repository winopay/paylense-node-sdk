const paylense = require("../lib/");

const { Collections } = paylense.create();

// initialise collections
const collections = Collections();

// Request to pay
collections
  .requestToPay({
    phone_number: "256774290781",
    amount: "50",
    processing_number: "947354",
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
