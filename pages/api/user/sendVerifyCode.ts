import { NextApiRequest, NextApiResponse } from 'next';
import { format } from 'date-fns';
import md5 from 'md5';
import { withIronSessionApiRoute } from 'iron-session/next'
import { encode } from 'js-base64';
import request from 'service/fetch';
import { ISession } from '..';
import { ironOptions } from 'config';

export default withIronSessionApiRoute(sendVerifyCode,ironOptions)

async function sendVerifyCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { to = '', templateId = '1' } = req.body;
  const appId = '2c94811c8853194e01887548c36c0922';
  const accountId = '2c94811c8853194e01887548c228091b';
  const authToken = '70cb145322aa49f290c979a42ee90d67';
  const nowData = format(new Date(), 'yyyyMMddHHmmss');
  const sigParameter = md5(`${accountId}${authToken}${nowData}`);
  const authorization = encode(`${accountId}:${nowData}`);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMin = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${accountId}/SMS/TemplateSMS?sig=${sigParameter}`;
  const session:ISession = req.session

  console.log(verifyCode)

  const result = await request.post(url, {
    to,
    templateId,
    appId: appId,
    datas: [verifyCode,expireMin],
  },{
    headers:{
        Authorization: authorization
    }
  });

  console.log(result)
  const { statusCode, statusMsg } = result as any
  if(statusCode  === '000000'){
      session.verifyCode = verifyCode
      await session.save()
      res.status(200).json({ code: 0, msg: statusMsg, data: { name:"Jason" } });
  }
  else{
    res.status(200).json({ code: statusCode, msg: statusMsg });
  }
}
