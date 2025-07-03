import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt/jwt.guard";

@Controller("user")
export class UserController {
  constructor() {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findUserByProviderAccountId(@Req() req: Request) {
    return req.user;
  }
}
