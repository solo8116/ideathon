export class CustomError extends Error {
    private status: number;
  
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      Error.captureStackTrace(this, this.constructor);
    }
  }