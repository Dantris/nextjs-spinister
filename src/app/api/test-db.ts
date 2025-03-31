import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Fetch all users (assuming you have a 'User' model in Prisma)
        const users = await prisma.user.findMany();

        res.status(200).json(users);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    } finally {
        await prisma.$disconnect();
    }
}
