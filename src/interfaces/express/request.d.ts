import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      uid: string | undefined;
      name: string | undefined;
      email: string | undefined;
      picture?: string | undefined;
    };
  }
}
