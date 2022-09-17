import { Authorized } from "type-graphql";
import {
  ResolverActionsConfig,
  UserType,
} from "../../generated/typegql-prisma";

export const categoryActionsConfig: ResolverActionsConfig<"Category"> = {
  _all: [Authorized([UserType.ADMIN])],
};
