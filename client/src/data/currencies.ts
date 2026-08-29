import type { Currency } from "../types/currency";

export const CURRENCIES: Currency[] = [
  {
    code: "USD",
    title: "United States dollar",
    symbol: "$",
    description: "The official currency of the United States.",
  },
  {
    code: "EUR",
    title: "Euro",
    symbol: "€",
    description: "The official currency of the europa.",
  },
  {
    code: "PLN",
    title: "Polish zloty",
    symbol: "zł",
    description:
      "This is the official currency and legal tender of Poland. It is subdivided into 100 grosz-y (gr). It is the most traded" +
      "currency in Central and Eastern Europe and ranks 21st most-traded in the foreign exchange market. ",
  },
  {
    code: "JPY",
    title: "Japanese yen",
    symbol: "¥",
    description:
      "The yen is the official currency of Japan. It is the third-most traded currency in the foreign exchange market, after the United States dollar and the" +
      " euro. It is also widely used as a third reserve currency after the US dollar and the euro.",
  },
];
