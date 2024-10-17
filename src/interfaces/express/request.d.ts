import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string | undefined;
      uid: string | undefined;
      name: string | undefined;
      email: string | undefined;
      picture?: string | undefined;
    };
  }
}
