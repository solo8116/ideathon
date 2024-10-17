import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

export const getMyConversations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            participant1Id: userId,
          },
          {
            participant2Id: userId,
          },
        ],
      },
    });
    res.status(201).json({
      success: true,
      message: 'conversations fetched successfully',
      data: conversations,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getConversationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const conversationId = req.params.id;
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        OR: [
          {
            participant1Id: userId,
          },
          {
            participant2Id: userId,
          },
        ],
      },
      include: {
        messages: true,
        participant1: true,
        participant2: true,
      },
    });
    res.status(201).json({
      success: true,
      message: 'conversation fetched successfully',
      data: conversation,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteConversation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const conversationId = req.params.id;
    const conversation = await prisma.conversation.delete({
      where: {
        id: conversationId,
        OR: [
          {
            participant1Id: userId,
          },
          {
            participant2Id: userId,
          },
        ],
      },
    });
    res.status(201).json({
      success: true,
      message: 'conversation deleted successfully',
      data: conversation,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
