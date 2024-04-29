import { useState } from 'react';
import { prepareConnenction } from 'db';
import { Article } from 'db/entity';
import { IArticle } from 'pages/api';
import styles from './index.module.scss';
import { Avatar, Input, Button, message, Divider } from 'antd';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import Link from 'next/link';
import MarkDown from 'markdown-to-jsx';
import { usePostData } from 'hooks/useRequest';
import useTitle from 'hooks/useTitle';

interface Iprops {
  article: IArticle;
}

export async function getServerSideProps({ params }: any) {
  const db = await prepareConnenction();
  const articleId = params?.id;
  const articleRepo = await db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
    relations: ['user', 'comments', 'comments.user'],
  });

  if (article) {
    article.views += 1;
    await articleRepo.save(article);
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  };
}

const ArticleViews = (props: Iprops) => {
  const { article } = props;
  const {
    user: { nickname, avatar, id },
  } = article;

  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;

  const [inputVal, setInputVal] = useState('');
  const [comments, setComments] = useState(article?.comments || []);

  useTitle(`${article.title}-BlogC`)

  const {trigger} = usePostData({'url':'api/comment/publish',method: 'POST'},{
    onSuccess(res){
      if (res?.code === 0) {
        message.success('发表成功');
        const newComments = [
          {
            id: Math.random(),
            create_time: new Date(),
            update_time: new Date(),
            content: inputVal,
            user: {
              avatar: loginUserInfo?.avatar,
              nickname: loginUserInfo?.nickname,
            },
          },
        ].concat([...(comments as any)]);
        setComments(newComments);
        setInputVal('');
      }
    }
  })

  const handleComment = () => {
    trigger({
      articleId: article?.id,
      content: inputVal
    })
  };

  return (
    <div>
      <div className="content-layout">
        <h2 className={styles.title}>{article?.title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>
                {format(new Date(article?.update_time), 'yyyy-MM-dd hh:mm:ss')}
              </div>
              <div>阅读{article?.views}</div>
              {Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>编辑</Link>
              )}
            </div>
          </div>
        </div>
        <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
      </div>
      <div className={styles.divider}></div>
      <div className="content-layout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {loginUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论"
                  rows={4}
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e?.target?.value);
                  }}
                />
                <Button type="primary" onClick={handleComment}>
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment?.id}>
                <Avatar src={comment?.user?.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment?.update_time),
                        'yyyy-MM-dd hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ArticleViews);
