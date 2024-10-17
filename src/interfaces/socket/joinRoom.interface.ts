import { TargetType } from '@prisma/client';

export interface IJoinRoom {
  roomId: string;
  roomType: TargetType;
}
