import { MessageType, TargetType } from '@prisma/client';

export interface IMessage {
  type: MessageType;
  targetType: TargetType;
  content?: string;
  groupId?: string;
  conversationId?: string;
  replyId?: string;
  uploadUrl?: string;
  uploadPublicId?: string;
}
