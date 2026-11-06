export const deepFreeze = <T>(value: T): T => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
        Object.freeze(value);
        Object.values(value as object).forEach((v) => deepFreeze(v));
    }
    return value;
};
