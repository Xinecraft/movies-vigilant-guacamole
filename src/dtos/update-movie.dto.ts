import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateMovieDto {
  @MaxLength(255)
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @MaxLength(50)
  @IsNotEmpty()
  @IsOptional()
  genre: string;

  @MaxLength(1000)
  @IsNotEmpty()
  @IsOptional()
  description: string;
}
