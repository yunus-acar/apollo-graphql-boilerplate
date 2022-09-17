import { Authorized } from "type-graphql";
import {
  ResolverActionsConfig,
  UserType,
} from "../../generated/typegql-prisma";

export const userActionsConfig: ResolverActionsConfig<"User"> = {
  _all: [Authorized([UserType.ADMIN])],
};
