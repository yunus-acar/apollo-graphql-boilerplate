import jwt from "jsonwebtoken";
import { User } from "../generated/typegql-prisma";

class ITokenService {
  private jwt: typeof jwt;

  constructor(jwtInstance: typeof jwt) {
    this.jwt = jwtInstance;
  }

  generateUserToken(user: User) {
    const token = this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType: user.userType,
      },
      process.env.JWT_USER_SECRET!
    );

    return token;
  }

  verifyUserToken(token: string) {
    const result = this.jwt.verify(token, process.env.JWT_USER_SECRET!);

    return result;
  }
}

const TokenService = new ITokenService(jwt);

export default TokenService;
