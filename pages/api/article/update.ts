import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { prepareConnenction } from 'db';
import { Article, Tag } from 'db/entity';
import { EXCEPTION_ARTICLE } from '../config/code';

export default withIronSessionApiRoute(update, ironOptions);

async function update(req: NextApiRequest, res: NextApiResponse) {
  const { title = '', content = '', id = 0, tagIds = [] } = req.body;
  const db = await prepareConnenction();
  const articleRepo = db.getRepository(Article);
  const tagRepo = db.getRepository(Tag);

  const article = await articleRepo.findOne({
    where: {
      id: id,
    },
    relations: ['user','tags'],
  });

  const tags = await tagRepo.find({
    where: tagIds?.map((tagId: number) => ({ id: tagId })),
  });

  const newTags = tags?.map(tag => {
    if(tag.article_count !== 1){
        tag.article_count = tag.article_count + 1;
    }
    return tag;
  });


  if (article) {
    article.title = title;
    article.content = content;
    article.update_time = new Date();
    article.tags = newTags;

    const resArticle = await articleRepo.save(article);

    if (resArticle) {
      res.status(200).json({ data: resArticle, code: 0, msg: '更新成功' });
    } else {
      res.status(404).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILED });
    }
  }
}
