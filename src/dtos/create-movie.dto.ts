import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMovieDto {
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @MaxLength(50)
  @IsNotEmpty()
  genre: string;

  @MaxLength(1000)
  @IsNotEmpty()
  description: string;
}
