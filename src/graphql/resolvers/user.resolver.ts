import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { MyContext } from "../context";
import TokenService from "../../services/token.service";
import UserAuthPayload from "../payloads/userauth.payload";
import { UserType, User } from "@prisma/client";
import { UserCreateInput } from "../../generated/typegql-prisma";

@InputType()
class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver(() => UserAuthPayload)
class UserCustomResolver {
  @Mutation(() => UserAuthPayload)
  async login(
    @Arg("data") { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<UserAuthPayload> {
    const user = await ctx.prisma.user.findUnique({ where: { email } });
    console.log("🌵💜🐢", user);

    if (!user) throw new Error("Kullanıcı adı veya şifre hatalı");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Kullanıcı adı veya şifre hatalı");

    const token = TokenService.generateUserToken(user);
    return {
      id: user.id,
      email: user.email,
      userType: user.userType as UserType,
      name: user.name,
      token,
    };
  }
  @Mutation(() => Boolean)
  async register(
    @Arg("data")
    { email, password, surname, name, userType, gender }: UserCreateInput,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    try {
      const user = await ctx.prisma.user.create({
        data: {
          email,
          password,
          name,
          userType,
          surname,
          gender,
        },
      });
      console.log("🌵💜🐢", user);

      if (!user) {
        throw new Error("Kullanıcı oluşturulamadı");
      }
      return true;
    } catch (error) {
      console.log("🌵💜🐢 error", error);
      return false;
    }
  }
}

export default UserCustomResolver;
