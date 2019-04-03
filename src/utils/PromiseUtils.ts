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