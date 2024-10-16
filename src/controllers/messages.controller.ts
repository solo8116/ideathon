import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const getGroupMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid as string;
    const groupId = req.params.id;
    const messages = await prisma.message.findMany({
      where: {
        groupId,
        targetType: 'GROUP',
        group: {
          OR: [
            {
              members: {
                some: {
                  userId,
                },
              },
            },
            {
              adminId: userId,
            },
          ],
        },
      },
      include: {
        replies: true,
      },
    });
    res.status(200).json({
      success: true,
      message: 'group messages successfully',
      data: messages,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getConversationMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid as string;
    const conversationId = req.params.id;
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        targetType: 'CONVERSATION',
        group: {
          OR: [
            {
              members: {
                some: {
                  userId,
                },
              },
            },
            {
              adminId: userId,
            },
          ],
        },
      },
      include: {
        replies: true,
      },
    });
    res.status(200).json({
      success: true,
      message: 'conversation messages successfully',
      data: messages,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
