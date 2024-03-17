import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from '..';
import { prepareConnenction } from 'db';
import { Comment, User, Article } from 'db/entity';
import { EXCEPTION_COMMENT } from '../config/code';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { articleId = 0, content = '' } = req.body;
  const db = await prepareConnenction();
  const commentRepo = db.getRepository(Comment);

  const comment = new Comment();
  comment.content = content;
  comment.create_time = new Date();
  comment.update_time = new Date();

  const user = await db.getRepository(User).findOne({
    where: {
      id: session?.userId,
    },
  });

  const article = await db.getRepository(Article).findOne({
    where: {
      id: articleId,
    },
  });

  if (user) {
    comment.user = user;
  }
  if (article) {
    comment.article = article;
  }

  const resComment = await commentRepo.save(comment);

  if (resComment) {
    res.status(200).json({
      code: 0,
      msg: '发表成功',
      data: resComment,
    });
  } else {
    res.status(404).json({
      ...EXCEPTION_COMMENT.PUBLISH_FAILED,
    });
  }
}
