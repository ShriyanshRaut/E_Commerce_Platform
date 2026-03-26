// constants/paymentStatus.js

// Payment lifecycle states

export const PAYMENT_STATUS = Object.freeze({
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
});

// Optional helper
export const isValidPaymentStatus = (status) => {
  return Object.values(PAYMENT_STATUS).includes(status);
};