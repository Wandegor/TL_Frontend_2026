import type { CurrencyDto } from "../dto/CurrencyDto.ts";
import type { Currency } from "../types/currency.ts";

export const mapCurrencyDtoToCurrency = (dto: CurrencyDto): Currency => {
  return {
    code: dto.code,
    name: dto.name,
    symbol: dto.symbol,
    description: dto.description,
  };
};
