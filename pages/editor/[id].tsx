import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useState, useEffect } from 'react';
import { Input, Button, message, Select } from 'antd';
import styles from './index.module.scss';
import request from 'hooks/useRequest/AxiosInstance';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { prepareConnenction } from 'db';
import { Article } from 'db/entity';
import { IArticle } from 'pages/api';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface IProps {
    article: IArticle
}

export async function getServerSideProps({ params } : any) {
    const db = await prepareConnenction();
    const articleId = params?.id;
    const articleRepo = await db.getRepository(Article);
    const article = await articleRepo.findOne({
      where: {
        id: articleId,
      },
      relations: ['user','tags'],
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

const ModifyEditor = ({article} : IProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [title, setTitle] = useState(article?.title || '');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [content, setContent] = useState(article?.content || '');
  const [allTags, setAllTags] = useState([]);
  const [tagIds, setTagIds] = useState((article?.tags?.map(tag => tag.id)) || []);

  console.log(tagIds)

  const { push, query } = useRouter();
  const articleId = Number(query?.id);

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

    request.post('/api/article/update',{
        id: article.id,
        title,
        content,
        tagIds
    }).then((res:any) => {
        if(res?.code === 0){
            articleId ? push(`/article/${articleId}`) : push('/')
            message.success('更新成功')
        }
        else{
            message.error(res?.msg || '更新失败');
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
    console.log(value)
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
        <Select className={styles.tag} mode="multiple" allowClear placeholder="请选择标签" onChange={handleSelectTag} defaultValue={tagIds}>
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

(ModifyEditor as any).layout = null;

export default observer(ModifyEditor);
