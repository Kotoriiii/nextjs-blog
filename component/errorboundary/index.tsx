import React from 'react';
import ErrorPage from 'component/errorpage';
import { Button } from 'antd';

interface IProps {
  children: React.ReactNode;
}

interface IState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): IState {
    console.error(error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by Error Boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorPage
          status={'500'}
          title="Application something is runing wrong"
          extra={<Button href="/" type="primary">back home</Button>}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
