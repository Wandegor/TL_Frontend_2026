import { describe, expect, it } from "vitest";
import type { CurrencyDto } from "../dto/CurrencyDto.ts";
import { mapCurrencyDtoToCurrency } from "../api/mappers/currencyMapper.ts";
import type { PriceChangeDto } from "../dto/PriceChangeDto.ts";
import { mapPriceChangeDtoToPriceChange } from "../api/mappers/priceChangeMapper.ts";

describe("mapCurrencyDtoToCurrency", () => {
  it("maps CurrencyDto to Currency", () => {
    const dto: CurrencyDto = {
      code: "PLN",
      name: "Polish zloty",
      description: "Official currency of Poland",
      symbol: "zł",
    };

    const result = mapCurrencyDtoToCurrency(dto);

    expect(result).toEqual(dto);
  });

  it("maps empty values", () => {
    const dto: CurrencyDto = {
      code: "",
      name: "",
      description: "",
      symbol: "",
    };

    const result = mapCurrencyDtoToCurrency(dto);

    expect(result).toEqual(dto);
  });
});

describe("mapPriceChangeDtoToPriceChange", () => {
  it("maps PriceChangeDto to PriceChange", () => {
    const dto: PriceChangeDto = {
      purchasedCurrencyCode: "JPY",
      paymentCurrencyCode: "CAD",
      price: 0.741,
      dateTime: "2026-05-21T03:40:54.2709677Z",
    };

    const result = mapPriceChangeDtoToPriceChange(dto);

    expect(result).toEqual({
      purchasedCurrencyCode: "JPY",
      paymentCurrencyCode: "CAD",
      price: 0.741,
      dateTime: new Date(dto.dateTime),
    });
  });

  it("maps boundary values", () => {
    const dto: PriceChangeDto = {
      purchasedCurrencyCode: "",
      paymentCurrencyCode: "",
      price: 0,
      dateTime: "1970-01-01T00:00:00.000Z",
    };

    const result = mapPriceChangeDtoToPriceChange(dto);

    expect(result).toEqual({
      purchasedCurrencyCode: "",
      paymentCurrencyCode: "",
      price: 0,
      dateTime: new Date(dto.dateTime),
    });
  });
});
