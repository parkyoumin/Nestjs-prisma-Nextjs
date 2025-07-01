import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "src/user/application/user.service";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
      throw new Error(
        "FATAL ERROR: JWT_SECRET_KEY is not defined in .env file",
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.access_token;
        },
      ]),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload) {
    const { providerAccountId } = payload;

    const user =
      await this.userService.findUserByProviderAccountId(providerAccountId);

    if (user) {
      return user;
    } else {
      console.error(
        "User not found with providerAccountId:",
        providerAccountId,
      );
      throw new NotFoundException("User not found");
    }
  }
}
