import {
  UserCrudResolver,
  CategoryCrudResolver,
  CategoryRelationsResolver,
  BlogCrudResolver,
  BlogRelationsResolver,
} from "../../generated/typegql-prisma";

import UserCustomResolver from "./user.resolver";
import UploadResolver from "./upload.resolver";

const resolvers = [
  UserCrudResolver,

  CategoryCrudResolver,
  CategoryRelationsResolver,

  UploadResolver,
  UserCustomResolver,

  BlogCrudResolver,
  BlogRelationsResolver,
] as const;

export default resolvers;
