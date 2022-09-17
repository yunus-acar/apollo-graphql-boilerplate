import { ResolversEnhanceMap } from "../../generated/typegql-prisma";

import { blogActionsConfig } from "./blog";
import { categoryActionsConfig } from "./category";
import { userActionsConfig } from "./user";

export const resolversEnhanceMap: ResolversEnhanceMap = {
  User: userActionsConfig,
  Category: categoryActionsConfig,
  Blog: blogActionsConfig,
};
