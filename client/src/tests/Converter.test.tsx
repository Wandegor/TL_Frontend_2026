import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Converter } from "../Converter.tsx";
import { CURRENCIES } from "../data/currencies.ts";
import { priceChanges } from "../data/priceChanges.ts";

const base = CURRENCIES[1];
const quote = CURRENCIES[3];
const anotherCurrency = CURRENCIES[0];

const initialAmount = 100;

describe("Converter", () => {
  it("renders currency fields and selects with mock data", () => {
    render(<Converter />);

    const amountInput = screen.getByRole("spinbutton", {
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

    expect(amountInput).toBeInTheDocument();
    expect(resultInput).toBeInTheDocument();
    expect(baseSelect).toBeInTheDocument();
    expect(quoteSelect).toBeInTheDocument();

    expect(amountInput).toHaveValue(initialAmount);
    expect(baseSelect).toHaveValue(base.code);
    expect(quoteSelect).toHaveValue(quote.code);

    expect(screen.getAllByRole("option")).toHaveLength(CURRENCIES.length * 2);
  });

  it("recalculates conversion when amount changes", () => {
    render(<Converter />);

    const amountInput = screen.getByRole("spinbutton", {
      name: "Сумма",
    });

    const resultInput = screen.getByRole("spinbutton", {
      name: "Результат",
    });

    const initialRate = priceChanges[base.code][quote.code].price;

    const expectedInitialResult = Number(
      (initialAmount * initialRate).toFixed(2),
    );
    expect(resultInput).toHaveValue(expectedInitialResult);

    const newAmount = 2;

    fireEvent.change(amountInput, {
      target: { value: String(newAmount) },
    });

    const expectedNewResult = Number((newAmount * initialRate).toFixed(2));

    expect(resultInput).toHaveValue(expectedNewResult);
  });

  it("recalculates conversion when currency pair changes", () => {
    render(<Converter />);

    const quoteSelect = screen.getByRole("combobox", {
      name: "Целевая валюта",
    });

    const resultInput = screen.getByRole("spinbutton", {
      name: "Результат",
    });

    fireEvent.change(quoteSelect, {
      target: { value: anotherCurrency.code },
    });

    const rate = priceChanges[base.code][anotherCurrency.code].price;

    const expectedResult = Number((initialAmount * rate).toFixed(2));

    expect(resultInput).toHaveValue(expectedResult);
  });

  it("does not allow selecting the same currency", () => {
    render(<Converter />);

    const baseSelect = screen.getByRole("combobox", {
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

  it("swaps currencies and recalculates the result", () => {
    render(<Converter />);

    const baseSelect = screen.getByRole("combobox", {
      name: "Исходная валюта",
    });

    const quoteSelect = screen.getByRole("combobox", {
      name: "Целевая валюта",
    });

    const resultInput = screen.getByRole("spinbutton", {
      name: "Результат",
    });

    const swapButton = screen.getByRole("button", {
      name: /swap/i,
    });

    expect(baseSelect).toHaveValue(base.code);
    expect(quoteSelect).toHaveValue(quote.code);

    fireEvent.click(swapButton);

    expect(baseSelect).toHaveValue(quote.code);
    expect(quoteSelect).toHaveValue(base.code);

    const swappedRate = priceChanges[quote.code][base.code].price;

    const expectedResult = Number((initialAmount * swappedRate).toFixed(2));

    expect(resultInput).toHaveValue(expectedResult);
  });

  it("resets MoreAbout state when currency pair changes", () => {
    render(<Converter />);

    const moreAboutButton = screen.getByRole("button", {
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
    const newMoreAboutButton = screen.getByRole("button", {
      name: `${anotherCurrency.code}/${quote.code}: about`,
    });

    expect(newMoreAboutButton).toBeInTheDocument();

    // Снова закрыт
    expect(
      screen.queryByText(anotherCurrency.description),
    ).not.toBeInTheDocument();
  });
});
