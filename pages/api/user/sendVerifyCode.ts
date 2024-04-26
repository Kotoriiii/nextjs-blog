import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from '..';
import { ironOptions } from 'config';
import { sendEmsWithAliCould } from 'util/index';

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const { phone ='13590425538' } = req.body;
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const session: ISession = req.session;

  try {
    const result = await sendEmsWithAliCould(phone, verifyCode);
    const { message, code } = result.body;
    if (code === 'OK' && message === 'OK') {
      session.verifyCode = verifyCode;
      session.startTime = String(Date.now());
      await session.save();
      res.status(200).json({ code: 0, msg: message });
    } else {
      res.status(400).json({ code: code, msg: message });
    }
  } catch (err) {
    res.status(500).json({ code: -1, msg: (err as any).message || '未知异常' });
  }
}
