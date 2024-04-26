import Link from 'next/link';
import { IArticle } from 'pages/api/index';
import styles from './index.module.scss';
import { EyeOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { markdownToTxt } from 'markdown-to-txt';

interface IProps {
  articles: IArticle;
}

const ListItem = (props: IProps) => {
  const { articles } = props;
  const { user } = articles;

  return (
    <Link href={`/article/${articles.id}`} style={{ textDecoration: 'none' }}>
      <div className={styles.container}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{user?.nickname}</span>
            <span className={styles.date}>
              {formatDistanceToNow(new Date(articles?.update_time))}
            </span>
          </div>
          <h4 className={styles.title}>{articles?.title}</h4>
          <p className={styles.content}>{markdownToTxt(articles?.content)}</p>
          <div className={styles.statistics}>
            <EyeOutlined />
            <span className={styles.item}>{articles.views}</span>
          </div>
        </div>
        <Avatar src={user?.avatar} size={48} />
      </div>
    </Link>
  );
};

export default ListItem;
