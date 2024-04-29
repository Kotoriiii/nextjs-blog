import React, { useState } from 'react';
import { Tabs, Button, message } from 'antd';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import styles from './index.module.scss';
import * as ANTD_ICONS from '@ant-design/icons';
import { useGetData, usePostData } from 'hooks/useRequest';
import Loading from 'component/loading';
import useTitle from 'hooks/useTitle';

const { TabPane } = Tabs;

interface IUser {
  id: number;
  nickname: string;
  avatar: string;
}

interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: IUser[];
}

interface IData {
  followTags: ITag[];
  allTags: ITag[];
}

const Tag = () => {
  const store = useStore();
  const [needRefresh, setNeedRefresh] = useState(false);
  const { userId } = store?.user?.userInfo|| {};

  useTitle('标签列表')

  const { trigger: followTag } = usePostData({
    url: '/api/tag/follow',
    method: 'POST'
  },{
    onSuccess(res){
      if (res?.code === 0) {
        message.success('关注成功');
        setNeedRefresh(!needRefresh);
      }
    }
  });
  const { trigger: UnfollowTag } = usePostData({
    url: '/api/tag/follow',
    method: 'POST'
  },{
    onSuccess(res){
      if (res?.code === 0) {
        message.success('取关成功');
        setNeedRefresh(!needRefresh);
      }
    }
  });

  const { data, isLoading } = useGetData<IData>({ url:'/api/tag/get' });
  if (isLoading) return <Loading/>;

  const handleUnFollow = (tagId:any) =>{
    UnfollowTag({
      type: 'unfollow',
      tagId
    });
  }

  const handleFollow = (tagId:number) =>{
    followTag({
      type: 'follow',
      tagId
    })
  }

  return (
    <div className="content-layout">
      <Tabs defaultActiveKey="all">
        <TabPane tab="已关注标签" key="follow" className={styles.tags}>
          {data?.followTags?.map((tag) => (
            <div key={tag?.title} className={styles.tagWrapper}>
              <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
              <div className={styles.title}>{tag?.title}</div>
              <div>
                {tag?.follow_count} 关注 {tag.article_count} 文章
              </div>
              {
                  tag?.users?.find((users) => Number(users?.id) === Number(userId)) ? (
                    <Button type='primary' onClick={()=>handleUnFollow(tag?.id)}>已关注</Button>
                  ): (
                    <Button onClick={()=>handleUnFollow(tag?.id)}>关注</Button>
                  )
                }
            </div>
          ))}
        </TabPane>
        <TabPane tab="全部标签" key="all" className={styles.tags}>
        {data?.allTags?.map((tag) => (
            <div key={tag?.title} className={styles.tagWrapper}>
              <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
              <div className={styles.title}>{tag?.title}</div>
              <div>
                {tag?.follow_count} 关注 {tag.article_count} 文章
              </div>
              {
                  tag?.users?.find((users) => Number(users?.id) === Number(userId)) ? (
                    <Button type='primary' onClick={()=>handleUnFollow(tag?.id)}>已关注</Button>
                  ): (
                    <Button onClick={()=>handleFollow(tag?.id)}>关注</Button>
                  )
                }
            </div>
          ))}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default observer(Tag);
