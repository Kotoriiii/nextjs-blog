import { useEffect } from 'react';

const useTitle = (titleName: string) => {
  useEffect(() => {
    document.title = titleName;
  }, [titleName]);
};

export default useTitle;
