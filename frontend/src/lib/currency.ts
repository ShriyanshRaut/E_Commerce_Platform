export const formatINR = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;
