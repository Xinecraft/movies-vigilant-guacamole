import { EntityRepository, Repository } from 'typeorm';
import { HttpException } from '@exceptions/HttpException';
import { MovieEntity } from '@/entities/movies.entity';
import { RatingEntity } from '@/entities/ratings.entity';
import { User } from '@/interfaces/users.interface';
import { CreateRatingDto } from '@/dtos/create-rating.dto';
import movieService from '@/services/movies.service';

@EntityRepository()
class RatingService extends Repository<RatingEntity> {
  public movieService = new movieService();

  async createRating(createRatingDto: CreateRatingDto, user: User) {
    const findMovie = await MovieEntity.findOne({ where: { id: createRatingDto.movieId } });
    if (!findMovie) throw new HttpException(404, 'Movie not found');

    // Check if we already have rating from this user then error
    const alreadyRated = await RatingEntity.findOne({
      where: {
        userId: user.id,
        movieId: createRatingDto.movieId,
      },
    });
    if (alreadyRated) {
      throw new HttpException(400, 'You have already rated for this movie');
    }

    const ratingObject = new RatingEntity();
    ratingObject.movieId = createRatingDto.movieId;
    ratingObject.rating = createRatingDto.rating;
    ratingObject.userId = user.id;
    const rating = await ratingObject.save();

    // Update movie avg count
    await this.movieService.incrementRating(createRatingDto.movieId, createRatingDto.rating, 1);

    return rating;
  }
}

export default RatingService;
