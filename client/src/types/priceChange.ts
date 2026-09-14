export type PriceChange = {
  purchasedCurrencyCode: string;
  paymentCurrencyCode: string;
  price: number;
  dateTime: Date;
};
export type PriceChanges = {
  [fromCurrency: string]: {
    [toCurrency: string]: PriceChange;
  };
};
