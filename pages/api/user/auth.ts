import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';

export default withIronSessionApiRoute(auth, ironOptions);

async function auth(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId } = session;

  if (!userId) {
    res.status(401).json({ code: -1, data: '', msg: '未登陆' });
    return;
  }

  res.status(200).json({ code: 0, data: userId, msg: '' });
}
