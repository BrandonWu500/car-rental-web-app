import { serverAuth } from '@/libs/serverAuth';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from './../../../libs/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const currentUser = await serverAuth(req, res);
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized' });

    const { listingId } = req.query;

    if (!listingId || typeof listingId !== 'string') {
      throw new Error('Invalid ID');
    }

    const reservations = await prisma.reservation.findMany({
      where: { listingId },
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(reservations);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
