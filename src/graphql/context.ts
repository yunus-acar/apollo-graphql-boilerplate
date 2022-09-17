import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";
import { verify } from "jsonwebtoken";
import { UserType } from "../generated/typegql-prisma";
import DatabaseService from "../services/database.service";

export interface ContextUser {
  id: string;
  email: string;
  userType: UserType;
  iat: number;
  exp: number;
}

export interface MyContext extends ExpressContext {
  user?: ContextUser;
  prisma: PrismaClient;
}

export function createContext(ctx: MyContext) {
  let token: string | undefined;
  if (ctx.req.headers.authorization) {
    token = ctx.req.headers.authorization.split("Bearer ")[1];
  }

  if (token) {
    verify(token, process.env.JWT_USER_SECRET!, (_err, decodedToken) => {
      ctx.user = decodedToken as ContextUser;
    });
  }

  return {
    ...ctx,
    prisma: DatabaseService.client,
  };
}
