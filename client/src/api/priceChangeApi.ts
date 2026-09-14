import type { PriceChangeDto } from "../dto/PriceChangeDto.ts";
import { api_url } from "./api.ts";
import { mapPriceChangeDtoToPriceChange } from "./mappers/priceChangeMapper.ts";
import type { PriceChange } from "../types/priceChange.ts";

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
}: GetPricesParams): Promise<PriceChange[]> => {
  const params = new URLSearchParams({
    paymentCurrency,
    purchasedCurrency,
    fromDateTime,
  });

  if (toDateTime) {
    params.append("toDateTime", toDateTime);
  }

  const response = await fetch(`${api_url}/prices?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to load price changes");
  }

  const priceChangeDtos: PriceChangeDto[] = await response.json();

  return priceChangeDtos.map(mapPriceChangeDtoToPriceChange);
};
