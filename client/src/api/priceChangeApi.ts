import type { PriceChangeDto } from "../dto/PriceChangeDto.ts";

const API_URL = "http://localhost:5081";

type GetPricesParams = {
  paymentCurrency: string;
  purchasedCurrency: string;
  fromDateTime: string;
  toDateTime?: string;
};

export const getPriceChanges = async ({
  paymentCurrency,
  purchasedCurrency,
  fromDateTime,
  toDateTime,
}: GetPricesParams): Promise<PriceChangeDto[]> => {
  const params = new URLSearchParams({
    paymentCurrency,
    purchasedCurrency,
    fromDateTime,
  });

  if (toDateTime) {
    params.append("toDateTime", toDateTime);
  }

  const response = await fetch(`${API_URL}/prices?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to load price changes");
  }

  return response.json();
};
