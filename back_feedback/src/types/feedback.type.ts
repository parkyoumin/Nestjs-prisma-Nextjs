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

  @IsNotEmpty()
  userId: bigint;
}

export class GetFeedbacksByProjectDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  userId: bigint;

  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  pageSize: number;
}
