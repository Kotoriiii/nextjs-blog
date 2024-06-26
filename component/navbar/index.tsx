import { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import styles from './index.module.scss';
import { navs } from './config';
import { useRouter } from 'next/router';
import { Button, Avatar, Dropdown, Menu, message } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import Login from 'component/login';
import { useStore } from 'store';
import { usePostData } from 'hooks/useRequest';
import { observer } from 'mobx-react-lite';

const Navbar: NextPage = () => {
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const { trigger } = usePostData({ url: '/api/user/logout', method: 'Post' }, {
    onSuccess(data){
      if(data.code === 0){
        store.user.setUserInfo({});
      }
    }
  });

  const handleGoToEditorPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登入');
    }
  };

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`);
  };

  const handleLogout = () => {
    trigger();
  };

  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={handleGotoPersonalPage}>
          <HomeOutlined />
          &nbsp; 个人主页
        </Menu.Item>
        <Menu.Item onClick={handleLogout}>
          <LoginOutlined />
          &nbsp; 退出系统
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((item) => (
          <Link key={item?.label} href={item?.value} legacyBehavior>
            <a className={pathname === item?.value ? styles.active : ''}>
              {item?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGoToEditorPage} className={styles.operationButton}>写文章</Button>
        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottom" className={styles.operationButton}>
              <Avatar src={avatar} size={32} ></Avatar>
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin} className={styles.operationButton}>
            登陆
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);
