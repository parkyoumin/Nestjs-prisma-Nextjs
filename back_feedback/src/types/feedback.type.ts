import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;
}

export class DeleteFeedbackDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @BigInt()
  @IsNotEmpty()
  userId: bigint;
}
