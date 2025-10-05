import { User } from "@prisma/client";

export type LoginUser = User & {
  accessToken: string;
}