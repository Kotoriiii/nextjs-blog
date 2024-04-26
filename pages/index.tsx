import { useState, useEffect } from 'react';
import { prepareConnenction } from 'db';
import { Article, Tag } from 'db/entity';
import ListItem from 'component/ListItem';
import { Divider } from 'antd';
import { IArticle } from './api';
import { Itag } from './api';
import classnames from 'classnames';
import styles from './index.module.scss';
import request from 'hooks/useRequest/AxiosInstance';

interface IProps {
  articles: IArticle[];
  tags: Itag[];
}

export async function getServerSideProps() {
  const db = await prepareConnenction();
  const articles = await db.getRepository(Article).find({
    relations: ['user', 'tags'],
  });

  const tags = await db.getRepository(Tag).find({
    relations: ['users'],
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(tags)) || [],
    },
  };
}

const Home = (props: IProps) => {
  const { articles, tags } = props;
  const [selectTag, setSelectTag] = useState(0);
  const [showAricles, setShowAricles] = useState([...articles]);
  const [active, setActive] = useState('');

  const handleSelectTag = (e: any) => {
    const { tagid, active } = e?.target?.dataset || {};

    if (active === 'active') {
      setSelectTag(0);
      setActive('');
    } else {
      setSelectTag(Number(tagid));
      setActive('active');
    }
  };

  useEffect(() => {
    if (selectTag) {
      request.get(`/api/article/get?tagid=${selectTag}`).then((res: any) => {
        if (res?.code === 0) {
          setShowAricles(res?.data);
        }
      });
    } else {
      request.get(`/api/article/get`).then((res: any) => {
        if (res?.code === 0) {
          setShowAricles(res?.data);
        }
      });
    }
  }, [selectTag]);

  return (
    <div>
      <div className={styles.tags} onClick={handleSelectTag}>
        {tags?.map((tag) => (
          <div
            key={tag?.id}
            data-tagid={tag?.id}
            data-active={active}
            className={classnames(
              styles.tag,
              selectTag === tag?.id ? styles.active : ''
            )}
          >
            {tag?.title}
          </div>
        ))}
      </div>
      <div className="content-layout">
        {showAricles.map((item) => (
          <div key={item.id}>
            <ListItem articles={item} />
            <Divider />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
