function createTaskQueue({ concurrency = 2, fn, onData }) {
  const arr = [];
  let nRunning = 0;

  const run = async () => {
    if (nRunning + 1 <= concurrency && arr.length) {
      nRunning += 1;
      const arg = arr.shift();
      const res = await fn(arg);
      nRunning -= 1;
      await onData(arg, res);
      run();
    }
  };

  const push = (arg) => {
    arr.push(arg);
    run();
  };

  return {
    push,
    get isComplete() {
      return arr.length === 0 && nRunning === 0;
    },
    get status() {
      return { nRunning, length: arr.length };
    },
  };
}

export default createTaskQueue;
