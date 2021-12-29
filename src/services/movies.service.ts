import { EntityRepository, getConnection, Not, Repository } from 'typeorm';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { MovieEntity } from '@/entities/movies.entity';
import { CreateMovieDto } from '@/dtos/create-movie.dto';

@EntityRepository()
class MovieService extends Repository<MovieEntity> {
  public async paginateMovies(skip = 0, take = 10): Promise<any> {
    const users = await MovieEntity.find({
      skip,
      take,
      order: { id: 'ASC' },
    });
    return users;
  }

  public async findMovieById(movieId: number): Promise<any> {
    if (isEmpty(movieId)) throw new HttpException(400, 'MovieId not valid');

    const findMovie = await MovieEntity.findOne({ where: { id: movieId } });
    if (!findMovie) throw new HttpException(404, 'Movie not found with provided Id');

    return findMovie;
  }

  public async createMovie(movieData: CreateMovieDto, user: any): Promise<any> {
    if (isEmpty(movieData)) throw new HttpException(400, ',MovieData not valid');

    const findMovie = await MovieEntity.findOne({ where: { title: movieData.title } });
    if (findMovie) throw new HttpException(422, `Movie with that title already exists`);

    const createMovieData = new MovieEntity();
    createMovieData.title = movieData.title;
    createMovieData.genre = movieData.genre;
    createMovieData.description = movieData.description;
    createMovieData.user = user;
    await createMovieData.save();
    delete createMovieData.user.password;
    return createMovieData;
  }

  public async updateMovie(movieId: number, movieData: CreateMovieDto): Promise<any> {
    if (isEmpty(movieData)) throw new HttpException(400, 'MovieData is not valid');

    // Error if there is already exists same title except self
    if (movieData.title) {
      const alreadyExists = await MovieEntity.findOne({
        where: {
          title: movieData.title,
          id: Not(movieId),
        },
      });
      if (alreadyExists) {
        throw new HttpException(400, 'A movie with that title already exists');
      }
    }

    const findmovie = await MovieEntity.findOne({ where: { id: movieId } });
    if (!findmovie) throw new HttpException(404, 'Movie not found with given ID');

    await MovieEntity.update(movieId, movieData);
    const updatemovie = await MovieEntity.findOne({ where: { id: movieId } });
    return updatemovie;
  }

  public async deleteMovie(movieId: number): Promise<any> {
    if (isEmpty(movieId)) throw new HttpException(400, 'MovieId not valid');

    const findMovie = await MovieEntity.findOne({ where: { id: movieId } });
    if (!findMovie) throw new HttpException(404, 'Movie not found with given ID');

    await MovieEntity.delete({ id: movieId });
    return findMovie;
  }

  public async findOneWithUser(id: number) {
    return await MovieEntity.findOne(id, { relations: ['user'] });
  }

  /**
   * Increment the totalRatingValue and totalRatingCount via provided amount for a movie
   */
  async incrementRating(id: number, value: number, count: number) {
    return await getConnection()
      .createQueryBuilder()
      .update(MovieEntity)
      .set({
        totalRatingValue: () => `"totalRatingValue" + ${value}`,
        totalRatingCount: () => `"totalRatingCount" + ${count}`,
      })
      .where('id = :id', { id })
      .execute();
  }
}

export default MovieService;
