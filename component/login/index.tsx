import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import useCountDown from 'hooks/useCountDown';
import { message } from 'antd';
import { usePostData } from 'hooks/useRequest';
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
  const count = useCountDown(10, isShowVerifyCode, () =>
    setIsShowVerifyCode(false)
  );

  const { trigger: sendVerifyCode } = usePostData(
    {
      url: '/api/user/sendVerifyCode',
      method: 'POST',
    },
    {
      onSuccess(res) {
        if (res?.code === 0) {
          setIsShowVerifyCode(true);
        }
      },
    }
  );

  const { trigger: login } = usePostData(
    {
      url: '/api/user/login',
      method: 'POST',
    },
    {
      onSuccess(res) {
        if (res?.code === 0) {
          store.user.setUserInfo(res?.data);
          onClose && onClose();
        }
      },
    }
  );

  const handleClose = () => {
    onClose && onClose();
  };

  const handleGetVerifyCode = () => {
    if (!form?.phone) {
      message.warning('请输入手机号');
      return;
    }
    sendVerifyCode({
      phone: form.phone,
    });
  };

  const handleLogin = () => {
    if (!form?.phone) {
      message.warning('请输入手机号');
      return;
    }
    if (!form?.verify) {
      message.warning('请输入验证号');
      return;
    }
    login({
      ...form,
      identity_type: 'phone',
    });
  };

  const handleOAuthGithub = () => {
    const githubClientId = process.env.NEXT_PUBLIC_githubClientId;
    const redirectUri = `${window.location}api/oauth/redirect`;
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}`,
      '_self'
    );
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
              <div className={styles.countDown}>{count}</div>
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
