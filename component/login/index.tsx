import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import CountDown from 'component/countdown';
import { message } from 'antd';
import request from 'service/fetch';
import { useStore } from 'store/index';
import { observer } from 'mobx-react-lite';

interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const store = useStore();
  const { isShow = false, onClose } = props;
  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });

  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);

  const handleClose = () => {
    onClose && onClose();
  };

  const handleGetVerifyCode = () => {
    if (!form?.phone) {
      message.warning('请输入手机号');
      return;
    }
    request
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
        templateId: 1,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          setIsShowVerifyCode(true);
        } else {
          message.warning(res?.msg || '未知错误');
        }
      });
  };

  const handleLogin = () => {
    request
      .post('/api/user/login', {
        ...form,
        identity_type: 'phone',
      })
      .then((res: any) => {
        if (res?.code === 0) {
          store.user.setUserInfo(res?.data);
          console.log(store);
          onClose && onClose();
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };

  const handleOAuthGithub = () => {
    const githubClientId = process.env.NEXT_PUBLIC_githubClientId;
    const redirectUri = 'https://nextjs-blog-nee3w9i79-kotoriiiis-projects.vercel.app/oauth/redirect';
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}`,
      '_self'
    );
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
  };

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登陆</div>
          <div className={styles.close} onClick={handleClose}>
            x
          </div>
        </div>
        <input
          name="phone"
          type="text"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        ></input>
        <div className={styles.verifyCodeArea}>
          <input
            name="verify"
            type="text"
            placeholder="请输入验证码"
            value={form.verify}
            onChange={handleFormChange}
          ></input>
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={10} onEnd={handleCountDownEnd} />
            ) : (
              '获取验证码'
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登陆
        </div>
        <div className={styles.otherLogin} onClick={handleOAuthGithub}>
          使用Github登陆
        </div>
        <div className={styles.loginPrivacy}>
          注册登陆即表示同意
          <a
            href="https://moco.imooc.com/privacy.html"
            target="_blank"
            rel="noreferrer"
          >
            隐私政策
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default observer(Login);
