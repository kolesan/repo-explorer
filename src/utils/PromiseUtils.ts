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

export const sequenceStartingValue = Symbol("Special value that needs to be ignored during sequential promise processing");
export function sequential(then: (val: any) => void) {
  let lastPromise = Promise.resolve(sequenceStartingValue);

  return function toSequence(promiseProvider: (val: any) => Promise<any>) {
    return lastPromise = lastPromise.then(nextPromise);

    function nextPromise(lastPromiseResult: any) {
      return promiseProvider(lastPromiseResult).then(acceptResult);
    }
  }

  function acceptResult(result: any) {
    then(result);
    return result;
  }
  
}


export function all(...promises: Promise<any>[]) {
  return {
    then(fn: (v: any) => void) {
      return Promise.all(promises.map(promise => promise.then(fn)));
    }
  }
}