import { AuthChecker } from "type-graphql";
import { MyContext } from "../graphql/context";

export const authChecker: AuthChecker<MyContext> = async (
  { context },
  roles
) => {
  if (context.user && roles.length === 0) {
    return true;
  }

  if (context.user && roles.some((role) => role === context.user?.userType)) {
    const id = context.user.id;
    const user = await context.prisma.user.findFirst({
      where: {
        AND: [{ id: { equals: id } }],
      },
    });
    if (!user) return false;
    return true;
  }
  return false;
};
