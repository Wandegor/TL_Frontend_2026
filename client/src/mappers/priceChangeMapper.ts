import type { PriceChange } from "../types/priceChange.ts";
import type { PriceChangeDto } from "../dto/PriceChangeDto.ts";

export const mapPriceChangeDtoToPriceChange = (
  dto: PriceChangeDto,
): PriceChange => {
  return {
    purchasedCurrencyCode: dto.purchasedCurrencyCode,
    paymentCurrencyCode: dto.paymentCurrencyCode,
    price: dto.price,
    dateTime: dto.dateTime,
  };
};
