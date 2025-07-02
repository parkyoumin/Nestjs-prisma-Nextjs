import { IsNotEmpty, IsString } from "class-validator";

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;
}
