import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './index.module.scss';
import { prepareConnenction } from 'db';
import { User, Article } from 'db/entity';
import { Avatar, Button, Divider } from 'antd';
import {
  CodeOutlined,
  FireOutlined,
  FundViewOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import ListItem from 'component/ListItem';

export async function getServerSideProps({ params }: any) {
  const userId = params?.id;
  const db = await prepareConnenction();
  const user = await db.getRepository(User).findOne({
    where: {
      id: Number(userId),
    },
  });

  const articles = await db.getRepository(Article).find({
    relations: ['user', 'tags'],
    where: {
      user: {
        id: Number(userId),
      },
    },
  });

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      articles: JSON.parse(JSON.stringify(articles)),
    },
  };
}

const UserDetail = (props: any) => {
  const { userInfo = {}, articles = [] } = props;
  const viewCount = articles?.reduce(
    (prev: any, next: any) => prev + next?.views,
    0
  );

  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} src={userInfo?.avatar} size={90} />
          <div>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined />
              {userInfo?.job}
            </div>
            <div className={styles.desc}>
              <FireOutlined />
              {userInfo?.introduce}
            </div>
          </div>
          <Link href="/user/profile">
            <Button>编辑个人资料</Button>
          </Link>
        </div>
        <Divider />
        <div className={styles.article}>
          {articles?.map((article: any) => (
            <div key={article?.id}>
              <ListItem articles={article} />
              <Divider />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>个人成就</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>共创建{articles?.length}篇文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>文章被阅读{viewCount}次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(UserDetail);
