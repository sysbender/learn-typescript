import { test, expect } from "vitest";

/**
 * Adds two numbers together.
 * @param a The first number.
 * @param b The second number.
 * @returns The sum of a and b.
 */
export function add(a: number, b: number): number {
  return a + b;
}

// ===============================================
// IN-SOURCE TEST BLOCK (Vitest will recognize this)
// ===============================================

// Vitest runs this block only when executing tests.
if (import.meta.vitest) {
  test("add function handles positive integers correctly", () => {
    // Assert the result of the function call
    expect(add(1, 2)).toBe(3);
    expect(add(10, 5)).toBe(15);
  });

  test("add function handles negative numbers correctly", () => {
    expect(add(-1, -5)).toBe(-6);
    expect(add(10, -3)).toBe(7);
  });

  test("add function handles floating point numbers", () => {
    // Use toBeCloseTo for floating point comparisons to avoid precision errors
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });
}
