import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { AxiosRequestConfig, AxiosError } from 'axios';
import requestInstance from './AxiosInstance';

interface Response<Data> {
  code: number;
  data: Data;
  msg: string;
}

interface useGetResponse<Data, Error>
  extends Pick<SWRResponse<Response<Data>, AxiosError<Error>>, 'isValidating' | 'error' | 'mutate' | 'isLoading'> {
  data: Data | undefined;
  response: Response<Data> | undefined;
}

function useGetData<Data = any, Error = any>(
  request: AxiosRequestConfig,
  config?: SWRConfiguration
): useGetResponse<Data, Error> {
  const {
    data: response,
    error,
    mutate,
    isValidating,
    isLoading,
  } = useSWR<Response<Data>, AxiosError<Error>>(request.url, () => requestInstance.request(request), config);
  return {
    data: response?.data,
    response,
    error,
    mutate,
    isValidating,
    isLoading
  };
}


export default useGetData;