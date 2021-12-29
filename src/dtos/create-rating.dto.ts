import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @Min(0)
  @Max(100)
  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
