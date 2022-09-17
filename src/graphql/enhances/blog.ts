import { Authorized } from "type-graphql";
import {
  ResolverActionsConfig,
  UserType,
} from "../../generated/typegql-prisma";

export const blogActionsConfig: ResolverActionsConfig<"Blog"> = {
  _all: [Authorized([UserType.ADMIN])],
};
