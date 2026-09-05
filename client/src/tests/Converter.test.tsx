import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Converter } from "../Converter.tsx";
import { getCurrencies } from "../api/currencyApi.ts";
import { getPriceChanges } from "../api/priceChangeApi.ts";

vi.mock("../api/currencyApi.ts");
vi.mock("../api/priceChangeApi.ts");

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
  {
    code: "JPY",
    name: "Japanese yen",
    description: "Japanese currency",
    symbol: "¥",
  },
];

const base = currencies[0];
const quote = currencies[1];
const anotherCurrency = currencies[2];

const priceChanges = {
  [base.code]: {
    [quote.code]: {
      purchasedCurrencyCode: quote.code,
      paymentCurrencyCode: base.code,
      price: 1.11,
      dateTime: "2026-09-05T10:00:00.000Z",
    },

    [anotherCurrency.code]: {
      purchasedCurrencyCode: anotherCurrency.code,
      paymentCurrencyCode: base.code,
      price: 0.74,
      dateTime: "2026-09-05T10:01:00.000Z",
    },
  },

  [quote.code]: {
    [base.code]: {
      purchasedCurrencyCode: base.code,
      paymentCurrencyCode: quote.code,
      price: 0.9,
      dateTime: "2026-09-05T10:02:00.000Z",
    },
  },
};

const mockedGetCurrencies = vi.mocked(getCurrencies);
const mockedGetPriceChanges = vi.mocked(getPriceChanges);

const initialAmount = 100;

const calculateConverted = (amount: number, rate: number) => {
  return Number((amount * rate).toFixed(2));
};

beforeEach(() => {
  vi.clearAllMocks();

  mockedGetCurrencies.mockResolvedValue(currencies);

  mockedGetPriceChanges.mockImplementation(
    async ({ paymentCurrency, purchasedCurrency }) => {
      const priceChange = priceChanges[paymentCurrency]?.[purchasedCurrency];

      if (!priceChange) {
        throw new Error(
          `No mock price for ${paymentCurrency}/${purchasedCurrency}`,
        );
      }

      return [priceChange];
    },
  );
});

describe("Converter", () => {
  it("renders currency fields and selects with data", async () => {
    render(<Converter />);

    const amountInput = await screen.findByRole("spinbutton", {
      name: "Сумма",
    });

    const resultInput = screen.getByRole("spinbutton", {
      name: "Результат",
    });

    const baseSelect = screen.getByRole("combobox", {
      name: "Исходная валюта",
    });

    const quoteSelect = screen.getByRole("combobox", {
      name: "Целевая валюта",
    });

    expect(amountInput).toHaveValue(initialAmount);
    await waitFor(() => {
      expect(resultInput).toHaveValue(
        calculateConverted(
          initialAmount,
          priceChanges[base.code][quote.code].price,
        ),
      );
    });

    expect(baseSelect).toHaveValue(base.code);
    expect(quoteSelect).toHaveValue(quote.code);

    expect(screen.getAllByRole("option")).toHaveLength(currencies.length * 2);
  });

  it("recalculates conversion when amount changes", async () => {
    render(<Converter />);

    const amountInput = await screen.findByRole("spinbutton", {
      name: "Сумма",
    });

    const resultInput = screen.getByRole("spinbutton", {
      name: "Результат",
    });

    const initialRate = priceChanges[base.code][quote.code].price;

    expect(resultInput).toHaveValue(
      calculateConverted(initialAmount, initialRate),
    );

    const newAmount = 2;

    fireEvent.change(amountInput, {
      target: { value: String(newAmount) },
    });

    expect(resultInput).toHaveValue(calculateConverted(newAmount, initialRate));
  });

  it("recalculates conversion when currency pair changes", async () => {
    render(<Converter />);

    const quoteSelect = await screen.findByRole("combobox", {
      name: "Целевая валюта",
    });

    const resultInput = screen.getByRole("spinbutton", {
      name: "Результат",
    });

    fireEvent.change(quoteSelect, {
      target: { value: anotherCurrency.code },
    });

    await waitFor(() => {
      expect(quoteSelect).toHaveValue(anotherCurrency.code);
      expect(resultInput).toHaveValue(
        calculateConverted(
          initialAmount,
          priceChanges[base.code][anotherCurrency.code].price,
        ),
      );
    });
  });

  it("does not allow selecting the same currency", async () => {
    render(<Converter />);

    const baseSelect = await screen.findByRole("combobox", {
      name: "Исходная валюта",
    });

    const quoteSelect = screen.getByRole("combobox", {
      name: "Целевая валюта",
    });

    fireEvent.change(quoteSelect, {
      target: { value: base.code },
    });

    expect(baseSelect).toHaveValue(base.code);
    expect(quoteSelect).toHaveValue(quote.code);
  });

  it("swaps currencies and recalculates the result", async () => {
    render(<Converter />);

    const baseSelect = await screen.findByRole("combobox", {
      name: "Исходная валюта",
    });

    const quoteSelect = screen.getByRole("combobox", {
      name: "Целевая валюта",
    });

    const resultInput = screen.getByRole("spinbutton", {
      name: "Результат",
    });

    const swapButton = screen.getByRole("button", {
      name: "swap",
    });

    expect(baseSelect).toHaveValue(base.code);
    expect(quoteSelect).toHaveValue(quote.code);

    fireEvent.click(swapButton);

    await waitFor(() => {
      expect(baseSelect).toHaveValue(quote.code);
      expect(quoteSelect).toHaveValue(base.code);
      expect(resultInput).toHaveValue(
        calculateConverted(
          initialAmount,
          priceChanges[quote.code][base.code].price,
        ),
      );
    });
  });

  it("resets MoreAbout state when currency pair changes", async () => {
    render(<Converter />);

    const moreAboutButton = await screen.findByRole("button", {
      name: `${base.code}/${quote.code}: about`,
    });

    // Изначально закрыт
    expect(screen.queryByText(base.description)).not.toBeInTheDocument();

    // Открывание
    fireEvent.click(moreAboutButton);

    // Появилось Описание
    expect(screen.getByText(base.description)).toBeInTheDocument();

    // Смена валюты
    const baseSelect = screen.getByRole("combobox", {
      name: "Исходная валюта",
    });

    fireEvent.change(baseSelect, {
      target: { value: anotherCurrency.code },
    });

    // Пересоздание благодаря key
    const newMoreAboutButton = await screen.findByRole("button", {
      name: `${anotherCurrency.code}/${quote.code}: about`,
    });

    expect(newMoreAboutButton).toBeInTheDocument();

    expect(
      screen.queryByText(anotherCurrency.description),
    ).not.toBeInTheDocument();
  });

  it("shows toast when price request fails", async () => {
    mockedGetPriceChanges
      .mockResolvedValueOnce([priceChanges[base.code][quote.code]])
      // при втором вызове getPriceChanges ошибка(текст не влияет)
      .mockRejectedValueOnce(new Error("lorem ipsum"));

    render(<Converter />);

    const quoteSelect = await screen.findByRole("combobox", {
      name: "Целевая валюта",
    });

    fireEvent.change(quoteSelect, {
      target: { value: anotherCurrency.code },
    });

    expect(
      await screen.findByText("COULD NOT GET PRICE DATA FROM THE SERVER"),
    ).toBeInTheDocument();
  });
});
