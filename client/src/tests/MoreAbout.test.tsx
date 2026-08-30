import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MoreAbout } from "../components/MoreAbout/MoreAbout.tsx";

const baseCurrency = {
  code: "PLN",
  name: "Polish zloty",
  symbol: "zł",
  description: "The official currency of Poland.",
};

const quoteCurrency = {
  code: "JPY",
  name: "Japanese yen",
  symbol: "¥",
  description: "The official currency of Japan.",
};

describe("MoreAbout", () => {
  it("renders the selected currency pair", () => {
    render(
      <MoreAbout baseCurrency={baseCurrency} quoteCurrency={quoteCurrency} />,
    );

    expect(
      screen.getByRole("button", {
        name: /PLN\/JPY: about/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders currency information and descriptions", () => {
    render(
      <MoreAbout baseCurrency={baseCurrency} quoteCurrency={quoteCurrency} />,
    );

    // имитация нажатия MoreAbout
    const button = screen.getByRole("button", { name: "PLN/JPY: about" });
    fireEvent.click(button);

    expect(screen.getByText("Polish zloty - PLN - zł")).toBeInTheDocument();

    expect(
      screen.getByText("The official currency of Poland."),
    ).toBeInTheDocument();

    expect(screen.getByText("Japanese yen - JPY - ¥")).toBeInTheDocument();

    expect(
      screen.getByText("The official currency of Japan."),
    ).toBeInTheDocument();
  });
});
