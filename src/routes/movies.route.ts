import { Router } from 'express';
import MoviesController from '@/controllers/movies.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateMovieDto } from '@/dtos/create-movie.dto';
import authMiddleware from '@middlewares/auth.middleware';
const routeCache = require('route-cache');

class MoviesRoute implements Routes {
  public path = '/movies';
  public router = Router();
  public moviesController = new MoviesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, routeCache.cacheSeconds(5), this.moviesController.index);
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, routeCache.cacheSeconds(5), this.moviesController.show);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateMovieDto, 'body'), this.moviesController.create);
    this.router.patch(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(CreateMovieDto, 'body', true), this.moviesController.update);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.moviesController.delete);
  }
}

export default MoviesRoute;
