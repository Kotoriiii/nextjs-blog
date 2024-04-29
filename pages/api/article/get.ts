import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { prepareConnenction } from 'db';
import { Article } from 'db/entity';

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
  const { tagid = 0 } = req?.query || {};
  const db = await prepareConnenction();
  const articleRepo = db.getRepository(Article);

  let articles = [];

  if (tagid) {
    articles = await articleRepo.find({
      relations: ['user', 'tags'],
      where: {
        tags: {
          id: Number(tagid),
        },
      },
    });
  } else {
    articles = await articleRepo.find({
      relations: ['user', 'tags'],
    });
  }

  res?.status(200).json({
    code: 0,
    msg: '',
    data: articles || [],
  });
}
