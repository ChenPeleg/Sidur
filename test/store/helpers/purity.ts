import { expect } from "vitest";

/** Deep clone used as a "before" snapshot of a reducer input. */
export const snapshot = <T>(value: T): T => structuredClone(value);

/**
 * Asserts the reducer input was not mutated in place: compares the snapshot
 * taken before the call with the same object after the call.
 */
export const expectInputUntouched = <T>(before: T, after: T) => {
    expect(after).toEqual(before);
};
