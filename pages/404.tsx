import { Button } from 'antd';
import ErrorPage from 'component/errorpage';

const Custom404 = () => {
  return (
    <ErrorPage
      status={'404'}
      title="404 not found"
      subTitle="the page is not found"
      extra={
        <Button href="/" type="primary">
          back home
        </Button>
      }
    />
  );
};

export default Custom404;
