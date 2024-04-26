import Dysmsapi20170525, {
  SendSmsRequest,
  SendSmsResponse,
} from '@alicloud/dysmsapi20170525';
import { Config } from '@alicloud/openapi-client';
import { RuntimeOptions } from '@alicloud/tea-util';

interface ICookieInfo {
  id: number;
  nickname: string;
  avatar: string;
}

export const setCookie = (
  cookies: any,
  { id, nickname, avatar }: ICookieInfo
) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';

  cookies.set('userId', id, { path, expires });
  cookies.set('nickname', nickname, { path, expires });
  cookies.set('avatar', avatar, { path, expires });
};

export const clearCookie = (cookies: any) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';

  cookies.set('userId', '', {
    path,
    expires,
  });
  cookies.set('nickname', '', {
    path,
    expires,
  });
  cookies.set('avatar', '', {
    path,
    expires,
  });
};

export const sendEmsWithAliCould = (
  phone: string,
  verify: number
): Promise<SendSmsResponse> => {
  const createClient = (): Dysmsapi20170525 => {
    // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html。
    let config = new Config({
      // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。
      accessKeyId: process.env['ALIBABA_CLOUD_ACCESS_KEY_ID'],
      // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
      accessKeySecret: process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET'],
    });
    // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
    config.endpoint = `dysmsapi.aliyuncs.com`;
    return new Dysmsapi20170525(config);
  };

  const client = createClient();
  const smsOptions = new SendSmsRequest({
    signName: '阿里云短信测试',
    templateCode: 'SMS_154950909',
    phoneNumbers: phone,
    templateParam: `{"code":"${verify}"}`,
  });
  const runtime = new RuntimeOptions({});

  return client.sendSmsWithOptions(smsOptions, runtime);
};
