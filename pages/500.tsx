import { Button } from 'antd';
import ErrorPage from 'component/errorpage';

const Custom500 = () => {
  return (
    <ErrorPage
      status={'500'}
      title="500 system error"
      subTitle="Application something is runing wrong"
      extra={
        <Button href="/" type="primary">
          back home
        </Button>
      }
    />
  );
};

export default Custom500;
