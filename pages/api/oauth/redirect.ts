import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from '..';
import request from 'service/fetch';
import { Cookie } from 'next-cookie'
import { prepareConnenction } from 'db';
import { UserAuth,User } from 'db/entity';
import { setCookie } from 'util/index';

export default withIronSessionApiRoute(redirect, ironOptions);

async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { code } = req?.query || {};
  const githubClientId = process.env.NEXT_PUBLIC_githubClientId;
  const githubSecret = process.env.githubSecret;
  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubSecret}&code=${code}`;

  const result = await request.post(
    url,
    {},
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );

  const { access_token } = result as any;

  console.log(access_token);

  const githubUserInfo = await request.get('https://api.github.com/user', {
    headers:{
        Accept: 'application/json',
        Authorization: `token ${access_token}`
    }
  })

  console.log(githubUserInfo)

  const { id:github_id, login='', avatar_url='' } = githubUserInfo as any;

  const cookies = Cookie.fromApiRoute(req,res);
  const db = await prepareConnenction();
  const userAuth = await db.getRepository(UserAuth).findOne({
    where: {
        identity_type: 'github',
        identifier: github_id
    },
    relations: {
        user: true,
    }

  },)

  if(userAuth){
    const user = userAuth.user;
    const { id, nickname, avatar } = user

    userAuth.credential = access_token;
    session.userId = id;
    session.nickname = nickname; 
    session.avatar = avatar;

    await session.save();

    setCookie(cookies,{id,nickname,avatar})

    res.redirect(302, '/')

  }
  else {

    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;

    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = github_id;
    userAuth.credential = access_token;
    userAuth.user = user;

    const resUserAuth = await db.getRepository(UserAuth).save(userAuth);

    const { id, nickname, avatar } = resUserAuth?.user || {};

    session.userId = id;
    session.nickname = nickname; 
    session.avatar = avatar;

    await session.save();

    setCookie(cookies,{id,nickname,avatar})
 
    res.redirect(302, '/')

  }
}
