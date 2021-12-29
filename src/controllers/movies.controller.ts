import { NextFunction, Request, Response } from 'express';
import movieService from '@/services/movies.service';
import { CreateMovieDto } from '@/dtos/create-movie.dto';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { User } from '@/interfaces/users.interface';

class MoviesController {
  public movieService = new movieService();

  public index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = +req.query.page || 1;
      let take = +req.query.perPage ? +req.query.perPage : 10;
      take = take > 100 ? 100 : take;
      const skip = (page - 1) * take;
      const findAllMoviesData = await this.movieService.paginateMovies(skip, take);

      res.status(200).json({ data: findAllMoviesData, message: 'index' });
    } catch (error) {
      next(error);
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movieId = Number(req.params.id);
      const findOneMovieData = await this.movieService.findMovieById(movieId);

      res.status(200).json({ data: findOneMovieData, message: 'show' });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movieData: CreateMovieDto = req.body;
      const createMovieData = await this.movieService.createMovie(movieData, req.user);

      res.status(201).json({ data: createMovieData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movieId = Number(req.params.id);

      await this.checkAuthorization(movieId, req.user);
      const movieData: CreateMovieDto = req.body;
      const updateMovieData = await this.movieService.updateMovie(movieId, movieData);

      res.status(200).json({ data: updateMovieData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movieId = Number(req.params.id);
      await this.checkAuthorization(movieId, req.user);
      const deleteMovieData = await this.movieService.deleteMovie(movieId);

      res.status(200).json({ data: deleteMovieData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Utility Function to throw error if req.user is not owner of the movie.
   * Todo Move it to Guard or Middleware
   * @param id Movie id
   * @param user User Entity
   */
  async checkAuthorization(id: number, user: User) {
    const movie = await this.movieService.findOneWithUser(id);
    if (!movie) throw new HttpException(404, 'Movie not found');

    if (movie.user.id != user.id) {
      throw new HttpException(403, 'You are not authorized to edit/delete this movie');
    }
  }
}

export default MoviesController;
