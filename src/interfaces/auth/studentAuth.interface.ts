import { IUser } from './user.interface';

export interface IStudentAuth extends IUser {
  email: string;
  semester: number;
  rollNumber: string;
}
