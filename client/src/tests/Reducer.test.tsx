import { describe, expect, it } from "vitest";
import { converterReducer, initialState } from "../reducer/converterReducer.ts";

describe("converterReducer", () => {
  it("sets loading state", () => {
    const state = converterReducer(initialState, {
      type: "FETCH_START",
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("stores currencies after successful fetch", () => {
    const currencies = [
      {
        code: "CAD",
        name: "Canadian dollar",
        description: "Canadian currency",
        symbol: "$",
      },
      {
        code: "AUD",
        name: "Australian dollar",
        description: "Australian currency",
        symbol: "$",
      },
    ];

    const state = converterReducer(initialState, {
      type: "FETCH_CURRENCIES_SUCCESS",
      payload: currencies,
    });

    expect(state.currencies).toEqual(currencies);
    expect(state.isLoading).toBe(false);
  });

  it("stores price history after successful fetch", () => {
    const priceHistory = [
      {
        purchasedCurrencyCode: "AUD",
        paymentCurrencyCode: "CAD",
        price: 1.11,
        dateTime: "2026-09-05T10:00:00.000Z",
      },
      {
        purchasedCurrencyCode: "AUD",
        paymentCurrencyCode: "CAD",
        price: 1.12,
        dateTime: "2026-09-05T10:01:00.000Z",
      },
    ];

    const state = converterReducer(initialState, {
      type: "FETCH_PRICE_SUCCESS",
      payload: priceHistory,
    });

    expect(state.priceHistory).toEqual(priceHistory);
  });

  it("stores error after failed fetch", () => {
    const message = "COULD NOT GET DATA FROM THE SERVER";

    const state = converterReducer(initialState, {
      type: "FETCH_ERROR",
      payload: message,
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual({
      name: "Fetch_Error",
      message,
    });
  });
});
