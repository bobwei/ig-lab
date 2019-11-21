function createTaskQueue({ concurrency = 2, fn }) {
  const arr = [];
  let nRunning = 0;

  const run = async () => {
    if (nRunning + 1 <= concurrency && arr.length) {
      nRunning += 1;
      await fn(arr.shift());
      nRunning -= 1;
      run();
    }
  };

  const push = (arg) => {
    arr.push(arg);
    run();
  };

  return {
    push,
  };
}

export default createTaskQueue;
