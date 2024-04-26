import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from '..';
import { prepareConnenction } from 'db';
import { User, Article, Tag } from 'db/entity';
import { EXCEPTION_ARTICLE } from '../config/code';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = '', content = '', tagIds = [] } = req.body;
  const db = await prepareConnenction();
  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);
  const tagRepo = db.getRepository(Tag);

  const user = await userRepo.findOne({
    where: {
      id: session.userId,
    },
  });

  const tags = await tagRepo.find({
    where: tagIds?.map((tagId: number) => ({ id: tagId })),
  });

  const article = new Article();
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;
  article.views = 0;

  if (user) {
    article.user = user;
  }

  if (tags) {
    const newTags = tags?.map((tag) => {
      tag.article_count = tag?.article_count + 1;
      return tag;
    });

    article.tags = newTags;
  }

  const resArticle = await articleRepo.save(article);

  if (resArticle) {
    res.status(200).json({ data: resArticle, code: 0, msg: '发布成功' });
  } else {
    res.status(404).json({ ...EXCEPTION_ARTICLE.PUBLISH_FAILED });
  }
}
