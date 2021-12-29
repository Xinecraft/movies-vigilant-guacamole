import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, BaseEntity } from 'typeorm';
import { UserEntity } from './users.entity';
import { MovieEntity } from './movies.entity';

@Index(['userId', 'movieId'], { unique: true })
@Entity()
export class RatingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  movieId: number;

  @Column()
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.ratings, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => MovieEntity, movie => movie.ratings, { onDelete: 'CASCADE' })
  movie: MovieEntity;
}
