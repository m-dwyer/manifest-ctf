import { Role } from "@prisma/client";
import { DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  role: Role;
}

declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface JWT extends IUser {}
}
