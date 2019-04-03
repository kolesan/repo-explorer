import { onlyLast, allInOrder } from "./PromiseUtils";

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

test(`'allInOrder' lets you stack promises and only perform the last one`, async () => {
  let results: number[] = [];
  let toQueue = allInOrder((result: number) => results.push(result));

  toQueue(delayedPromise(300).then(() => 1));
  toQueue(delayedPromise(100).then(() => 2));
  toQueue(delayedPromise(200).then(() => 3));
  await toQueue(Promise.resolve(4));

  expect(results).toEqual([1, 2, 3, 4]);
});

function delayedPromise(timeout: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, timeout));
}