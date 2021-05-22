const paylense = require("../lib");

const { Disbursements } = paylense.create();

// initialise collections
const disbursements = Disbursements();

// Transfer
disbursements
  .transfer({
    phone_number: "256774290781",
    amount: "50",
    processing_number: "947354",
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
