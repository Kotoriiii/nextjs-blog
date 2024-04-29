import '../styles/globals.css';
import Layout from 'component/layout';
import { StoreProvider } from 'store';
import { NextPage } from 'next';
import ErrorBoundary from 'component/errorboundary';
import { AppContext } from 'next/app';
import { IncomingMessage } from 'http';

interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage;
  pageProps: any;
}

interface IRequest extends IncomingMessage{
  cookies: Record<string, string>;
}

function MyApp({initialValue, Component, pageProps }: IProps) {

  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </Layout>
      );
    }
  };

  return (
    <StoreProvider initialValue={ initialValue }>
      {renderLayout()}
    </StoreProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: AppContext) => {
  const { userId, nickname, avatar } = (ctx?.req as IRequest).cookies || {};
  console.log((ctx?.req as IRequest).cookies)
  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  };
};

export default MyApp;
