import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "../application/user.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"))
  async findUserByProviderAccountId(@Req() req: Request) {
    const user = req.user;

    return {
      status: 200,
      data: user,
    };
  }
}
