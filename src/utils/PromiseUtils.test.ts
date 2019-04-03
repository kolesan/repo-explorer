import { onlyLast } from "./PromiseUtils";

jest.useRealTimers();

test(`'onlyLast' lets you stack promises and only perform the last one`, async () => {
  let someVariable = 0;
  let toOnlyLastStack = onlyLast((result: number) => someVariable = result);

  toOnlyLastStack(delayedPromise(300).then(() => 1));
  toOnlyLastStack(delayedPromise(100).then(() => 2));
  toOnlyLastStack(delayedPromise(200).then(() => 3));
  await toOnlyLastStack(Promise.resolve(4));

  expect(someVariable).toBe(4);
});

function delayedPromise(timeout: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, timeout));
}