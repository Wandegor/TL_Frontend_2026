import { api_url } from "./api.ts";
import { mapCurrencyDtoToCurrency } from "./mappers/currencyMapper.ts";
import type { Currency } from "../types/currency.ts";
import type { CurrencyDto } from "../dto/CurrencyDto.ts";

export const getCurrencies = async (): Promise<Currency[]> => {
  const response = await fetch(`${api_url}/Currency`);

  if (!response.ok) {
    throw new Error("Failed to fetch currency data");
  }
  const currencyDtos: CurrencyDto[] = await response.json();

  return currencyDtos.map(mapCurrencyDtoToCurrency);
};
