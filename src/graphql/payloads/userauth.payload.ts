import { Field, ObjectType } from "type-graphql";
import { UserType } from "@prisma/client";

@ObjectType()
class UserAuthPayload {
  @Field()
  token: string;

  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  userType: UserType;

  @Field(() => String, { nullable: true })
  name: string | null;
}

export default UserAuthPayload;
