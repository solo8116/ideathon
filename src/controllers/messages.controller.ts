import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { uploader } from '../utils/uploader.util';

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

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.file) {
      const result = await uploader(req.file);
      res.status(201).json({
        uploadUrl: result.secure_url,
        uploadPublicId: result.public_id,
      });
    } else {
      throw new Error('file is required');
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
