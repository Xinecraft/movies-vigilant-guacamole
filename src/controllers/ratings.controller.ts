import { NextFunction, Response } from 'express';
import ratingService from '@/services/ratings.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { CreateRatingDto } from '@/dtos/create-rating.dto';

class RatingsController {
  public ratingService = new ratingService();

  public create = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ratingData: CreateRatingDto = req.body;
      const createdRating = await this.ratingService.createRating(ratingData, req.user);

      res.status(201).json({ data: createdRating, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default RatingsController;
