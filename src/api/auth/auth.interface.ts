import { Role } from 'src/constants';

export interface ITokenPayload {
  id: string;
  email: string;
  role: Role;
}
