export type PriceChange = {
  purchasedCurrencyCode: string;
  paymentCurrencyCode: string;
  price: number;
  dateTime: string;
};
export type PriceChanges = {
  [fromCurrency: string]: {
    [toCurrency: string]: PriceChange;
  };
};
