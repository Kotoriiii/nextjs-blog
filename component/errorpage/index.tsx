import React from 'react';
import { Result } from 'antd';
import { ResultStatusType } from 'antd/es/result';

interface IProps {
  status?: ResultStatusType;
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode;
}

const ErrorPage: React.FC<IProps> = (props) => (
  <Result
    status={props.status}
    title={props.title}
    subTitle={props.subTitle}
    extra={props.extra}
  />
);

export default ErrorPage;
