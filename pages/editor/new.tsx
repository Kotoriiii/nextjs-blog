import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useEffect, useState } from 'react';
import { Input, Button, message, Select } from 'antd';
import styles from './index.module.scss';
import request from 'hooks/useRequest/AxiosInstance';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { useRouter } from 'next/router';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [title, setTitle] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [content, setContent] = useState('');
  const store = useStore();
  const { userId } = store.user.userInfo;
  const { push } = useRouter();
  const [allTags, setAllTags] = useState([]);
  const [tagIds, setTagIds] = useState([]);

  useEffect(()=>{
    request.get('/api/tag/get').then((res:any) => {
      if(res?.code === 0){
        setAllTags(res?.data?.allTags || []);
      }
    })
  },[])

  const handlePublish = () => {
    if(!title){
        message.warning('请输入标题');
        return;
    }

    request.post('/api/article/publish',{
        title,
        content,
        tagIds
    }).then((res:any) => {
        if(res?.code === 0){
            userId ? push(`/user/${userId}`) : push('/')
            message.success('发布成功')
        }
        else{
            message.error(res?.msg || '发布失败');
        }

    })

  };
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
  };

  const handleContentChange = (content: any) => {
    setContent(content)
  }

  const handleSelectTag = (value:any) => {
    setTagIds(value);
  }

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitleChange}
        ></Input>
        <Select className={styles.tag} mode="multiple" allowClear placeholder="请选择标签" onChange={handleSelectTag}>
          {
            allTags?.map((tag:any) => (
              <Select.Option key={tag?.id} value={tag?.id}>{tag?.title}</Select.Option>
            ))
          }
        </Select>
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>
      <MDEditor value={content} onChange={handleContentChange} />
    </div>
  );
};

(NewEditor as any).layout = null;

export default observer(NewEditor);
