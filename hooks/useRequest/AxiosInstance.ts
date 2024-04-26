import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';

const config: AxiosRequestConfig = {
  baseURL: '/',
  timeout: 5000,
  headers: { 'content-type': 'application/json;charset=UTF-8' },
  responseType: 'json',
};

interface ErrorResponse {
  code: number;
  msg: string | undefined;
}

const requestInstance = axios.create(config);

requestInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res?.status === 200) {
      return res?.data;
    } 
  },
  (err: AxiosError) => {
    message.error((err.response?.data as ErrorResponse).msg || '未知错误')
    Promise.reject(err);
  }
);

export default requestInstance;
