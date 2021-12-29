import { UserEntity } from './users.entity';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, AfterLoad, BaseEntity } from 'typeorm';
import { RatingEntity } from './ratings.entity';

@Entity()
export class MovieEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  title: string;

  @Column('varchar')
  genre: string;

  @Column('text')
  description: string;

  @Column('int', { default: 0 })
  totalRatingValue: number;

  @Column('int', { default: 0 })
  totalRatingCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.movies, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToMany(() => RatingEntity, rating => rating.movie)
  ratings: RatingEntity[];

  // Dynamically generated attribute
  avgRating: number;
  @AfterLoad()
  calculateAvgRating() {
    if (this.totalRatingCount <= 0) {
      this.avgRating = null;
    } else {
      this.avgRating = Math.round(this.totalRatingValue / this.totalRatingCount);
    }
  }
}
