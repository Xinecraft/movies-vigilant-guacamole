import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { Exclude } from 'class-transformer';
import { MovieEntity } from './movies.entity';
import { RatingEntity } from './ratings.entity';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  @IsNotEmpty()
  fullName: string;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Exclude()
  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MovieEntity, movie => movie.user)
  movies: MovieEntity[];

  @OneToMany(() => RatingEntity, rating => rating.user)
  ratings: RatingEntity[];
}
