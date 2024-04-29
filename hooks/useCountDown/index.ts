import { useState, useEffect } from 'react';

const useCountDown = (
  initCount: number,
  start: boolean,
  callback: Function
): number => {
  const [count, setCount] = useState(initCount);

  useEffect(() => {
    if (start) {
      const timeid = setInterval(() => {
        if (count === 1) {
          setCount(initCount);
          callback();
        } else {
          setCount(count - 1);
        }
      }, 1000);

      return () => {
        clearInterval(timeid);
      };
    }
  }, [start, callback, count, initCount]);

  return count;
};

export default useCountDown;
