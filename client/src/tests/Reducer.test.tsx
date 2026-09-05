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
});
