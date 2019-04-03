export function onlyLast(then: Function) {
  let lastPromise;
  return async function makeLast(promise: Promise<any>) {
    lastPromise = promise;
    const result = await promise;
    if (promise === lastPromise) {
      then(result);
    }
  }
}

export function allInOrder(then: Function) {
  let lastPromise = Promise.resolve();
  return function toQueue(promise: Promise<any>) {
    return lastPromise = lastPromise.then(() => promise.then(result => then(result)));
  }
}
