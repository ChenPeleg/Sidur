export const customMatcherRunner = () => {
  expect.extend({
    toBePowerOf(received, power) {
      if (typeof power !== "number") {
        throw new Error("expected power to be a number");
      }

      if (typeof received !== "number") {
        throw new Error("expected value to be a number");
      }

      let receivedCopy = received;
      while (receivedCopy % power === 0) receivedCopy = receivedCopy / power;

      return receivedCopy === 1
        ? {
            pass: true,
            message: () => `Expected ${received} not to be a power of ${power}`,
          }
        : {
            pass: false,
            message: () => `Expected ${received} to be a power of ${power}`,
          };
    },

    /**@type {(received: any, message: any)=>void}
     * @param received1
     * @param received2
     * @param message
     * expect method*/
    eq(received1, received2, message) {
      if (!message) {
        message = `Expected ${received1} to be equal to ${received2}`;
      }
      /**@type {boolean} */
      let equal = false;

      if (received1 == received2) {
        equal = true;
      }
      return equal
        ? {
            pass: true,
            message: () => message,
          }
        : {
            pass: false,
            message: () => message,
          };
    },
  });
};
