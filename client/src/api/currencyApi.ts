import type { CurrencyDto } from "../dto/CurrencyDto.ts";

const API_URL = "http://localhost:5081";

export const getCurrencies = async (): Promise<CurrencyDto[]> => {
  const response = await fetch(`${API_URL}/Currency`);

  if (!response.ok) {
    throw new Error("Failed to fetch currency data");
  }
  return await response.json();
};
