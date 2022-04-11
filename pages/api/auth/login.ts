// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '../../../lib/firebase-admin';
import { serialize } from 'cookie';

interface ResponseData {
  status: boolean;
  data: unknown;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { token } = req.body;

  const expiresIn = 60 * 60 * 8 * 1000; // 8 hour

  try {
    const sessionCokie = await auth.createSessionCookie(token, { expiresIn });
    const user = await auth.verifySessionCookie(sessionCokie, true);

    res.setHeader('Set-Cookie', serialize('auth', sessionCokie, { httpOnly: true, secure: true, path: '/' }));
    res.status(200).json({
      status: true,
      data: user
    })
  } catch (err: any) {
    res.setHeader('Set-Cookie', '');
    res.status(403).json({
      status: false,
      data: null
    })
  }
}
