import { onlyLast, allInOrder, sequential, sequenceStartingValue } from "./PromiseUtils";

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

test(`'allInOrder' lets you enque promises and guarantees that 'then' will be called with their results in the order of stacking`, async () => {
  let results: number[] = [];
  let toQueue = allInOrder((result: number) => results.push(result));

  toQueue(delayedPromise(300).then(() => 1));
  toQueue(delayedPromise(100).then(() => 2));
  toQueue(delayedPromise(200).then(() => 3));
  await toQueue(Promise.resolve(4));

  expect(results).toEqual([1, 2, 3, 4]);
});

test(`'sequential' lets you enqueue functions that produce promises using the results of previous promises`, async () => {
  let results: number[] = [];
  const globalThen = (result?: any) => results.push(result);
  let toSequence = sequential(globalThen);

  const delayedPromiseProvider = (delay: number) => {
    return async (result: any) => {
      await delayedPromise(delay);
      return result === sequenceStartingValue ? 0 : result + 1;
    }
  }

  toSequence(delayedPromiseProvider(300));
  toSequence(delayedPromiseProvider(100));
  toSequence(delayedPromiseProvider(200));
  await toSequence(delayedPromiseProvider(0));

  expect(results).toEqual([0, 1, 2, 3]);
});

function delayedPromise(timeout: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, timeout));
}