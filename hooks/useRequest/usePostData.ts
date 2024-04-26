import useSWRMutation, { SWRMutationResponse, SWRMutationConfiguration } from 'swr/mutation';
import { AxiosError, AxiosRequestConfig } from 'axios';
import requestInstance from './AxiosInstance';
import { Key, Arguments } from 'swr';

interface Response<Data> {
  code: number;
  data: Data;
  msg: string;
}

interface usePostResponse<Data, Error>
  extends Pick<SWRMutationResponse<Response<Data>, AxiosError<Error>, Key, Arguments>, 'isMutating' | 'reset' | 'trigger' | 'error'> {
  data: Data | undefined;
  response: Response<Data> | undefined;
}

function usePostData<Data = any, Error = any>(
  request: AxiosRequestConfig,
  config?: SWRMutationConfiguration<Response<Data>, AxiosError<Error, any>, Key, Arguments, Response<Data>>
): usePostResponse<Data, Error> {
  const {
    isMutating,
    trigger,
    reset,
    data: response,
    error,
  } = useSWRMutation<Response<Data>, AxiosError<Error, any>, Key, Arguments, Response<Data>>(
    request.url,
    (url: string, { arg }: { arg: Arguments }) => requestInstance.request({...request, url, data: arg }).then(res => res as unknown as Response<Data>),
    config
  );

  return {
    data: response?.data,
    response: response,
    isMutating,
    trigger,
    reset,
    error,
  };
}

export default usePostData;
