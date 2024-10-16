import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { IAddMember, ICreateGroup } from '../interfaces';

const prisma = new PrismaClient();

export const getMyGroups = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid as string;
    const groups = await prisma.groupMember.findMany({
      where: {
        userId,
      },
      include: {
        group: true,
      },
    });
    res.status(200).json({
      success: true,
      message: 'groups fetched successfully',
      data: groups,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getGroupById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid as string;
    const groupId = req.params.id;
    const group = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      include: {
        group: {
          include: {
            messages: {
              include: {
                sender: true,
              },
            },
            members: true,
            admin: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: 'group fetched successfully',
      data: group,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const createGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid as string;
    const body: ICreateGroup = req.body;
    const validMembers = await Promise.all(
      body.members?.map(async (memberId) => {
        if (memberId === userId) {
          return null;
        }
        const userExists = await prisma.user.findUnique({
          where: {
            id: memberId,
          },
        });
        return userExists ? userExists.id : null;
      }) || [],
    ).then((result) => result.filter((memberId) => memberId !== null));

    const group = await prisma.group.create({
      data: {
        name: body.name,
        adminId: userId,
        members: {
          create: validMembers.map((memberId) => ({
            userId: memberId,
          })),
        },
      },
    });
    res.status(200).json({
      success: true,
      message: 'group created successfully',
      data: group,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid as string;
    const groupId = req.params.id;
    const body: IAddMember = req.body;
    const validMembers = await Promise.all(
      body.members?.map(async (memberId) => {
        if (memberId === userId) {
          return null;
        }
        const userExists = await prisma.user.findUnique({
          where: {
            id: memberId,
          },
        });
        return userExists ? userExists.id : null;
      }) || [],
    ).then((result) => result.filter((memberId) => memberId !== null));

    await prisma.group.update({
      where: {
        adminId: userId,
        id: groupId,
      },
      data: {
        members: {
          create: validMembers.map((memberId) => ({
            userId: memberId,
          })),
        },
      },
    });
    res.status(200).json({
      success: true,
      message: 'members added successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const removeMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid as string;
    const groupId = req.params.id;
    const body: IAddMember = req.body;
    const validMembers = await Promise.all(
      body.members?.map(async (memberId) => {
        if (memberId === userId) {
          return null;
        }
        const userExists = await prisma.user.findUnique({
          where: {
            id: memberId,
          },
        });
        return userExists ? userExists.id : null;
      }) || [],
    ).then((result) => result.filter((memberId) => memberId !== null));

    await Promise.all(
      validMembers.map(async (memberId) => {
        await prisma.groupMember.delete({
          where: {
            groupId_userId: {
              groupId,
              userId: memberId,
            },
          },
        });
      }),
    );
    res.status(200).json({
      success: true,
      message: 'members removed successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const leaveGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.uid as string;
    const groupId = req.params.id;

    const deletedGroup = await prisma.group.deleteMany({
      where: {
        id: groupId,
        adminId: userId,
      },
    });
    if (deletedGroup.count === 0) {
      await prisma.groupMember.deleteMany({
        where: {
          groupId,
          userId,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'group left successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
