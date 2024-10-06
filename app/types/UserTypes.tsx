export interface User {
  id: number;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
}
