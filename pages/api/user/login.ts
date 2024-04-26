import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from '..';
import { prepareConnenction } from 'db';
import { User, UserAuth } from 'db/entity/index';
import { Cookie } from 'next-cookie';
import { setCookie } from 'util/index';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone, verify, identity_type } = req.body;
  const db = await prepareConnenction();
  const userAuthRepo = db.getRepository(UserAuth);
  const session: ISession = req.session;
  const cookie = Cookie.fromApiRoute(req, res);
  const diffSecond = (Date.now() - Number(session.startTime)) / 1000;

  if (diffSecond > 60) {
    res?.status(400).json({
      code: -1,
      msg: '验证码已经过期',
    });
    return;
  }

  if (String(session.verifyCode) === String(verify)) {
    const auth = await userAuthRepo.findOne({
      where: {
        identity_type: identity_type,
        identifier: phone,
      },
      relations: {
        user: true,
      },
    });

    if (auth) {
      const user = auth.user;
      const { id, nickname, avatar } = user;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();

      setCookie(cookie, { id, nickname, avatar });

      res?.status(200).json({
        code: 0,
        msg: '登入成功',
        data: { userId: id, nickname, avatar },
      });
    } else {
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
      user.avatar = '/images/avatar.jpg';
      user.job = 'none';
      user.introduce = 'none';
      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;

      const resUserAuth = await userAuthRepo.save(userAuth);

      const {
        user: { id, nickname, avatar },
      } = resUserAuth;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();

      setCookie(cookie, { id, nickname, avatar });

      res?.status(200).json({
        code: 0,
        msg: '登入成功',
        data: { userId: id, nickname, avatar },
      });
    }
  } else {
    res?.status(400).json({ code: -1, msg: '验证码错误' });
  }
}
