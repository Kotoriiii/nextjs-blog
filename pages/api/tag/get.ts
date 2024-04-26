import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from '..';
import { prepareConnenction } from 'db';
import { Tag } from 'db/entity';

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId = 0 } = session;
  const db = await prepareConnenction();
  const tagRepo = db.getRepository(Tag);

  const followTags = await tagRepo.find({
    relations: ['users'],
    where: {
      users: {
        id: Number(userId),
      },
    },
  });

  const allTags = await tagRepo.find({
    relations: ['users'],
  });

  res?.status(200).json({
    code: 0,
    msg: '',
    data: {
      followTags,
      allTags,
    },
  });
}
