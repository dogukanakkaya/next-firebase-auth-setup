// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '../../../lib/firebase-admin';
import { parse, serialize } from 'cookie';

interface ResponseData {
    status: boolean;
    data: unknown;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { auth: authCookie } = parse(req?.headers.cookie || '', {});

    try {
        const user = await auth.verifySessionCookie(authCookie);

        res.status(200).json({
            status: true,
            data: user
        })
    } catch (err: any) {
        res.status(403).json({
            status: false,
            data: null
        })
    }
}
