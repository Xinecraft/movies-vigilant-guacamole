import { Router } from 'express';
import RatingsController from '@/controllers/ratings.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateRatingDto } from '@/dtos/create-rating.dto';

class RatingsRoute implements Routes {
  public path = '/ratings';
  public router = Router();
  public ratingsController = new RatingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateRatingDto, 'body'), this.ratingsController.create);
  }
}

export default RatingsRoute;
