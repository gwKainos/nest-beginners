import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  create(movieData: CreateMovieDto): Movie {
    // 새 Movie 객체를 변수에 담는다
    const newMovie: Movie = {
      id: this.movies.length + 1,
      ...movieData,
    };

    // 내부 배열에 넣고
    this.movies.push(newMovie);

    // 새로 생성된 객체 자체를 반환
    return newMovie;
  }

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(id: number) {
    const movie = this.movies.find((movie) => movie.id === id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }

    return movie;
  }

  deleteOne(id: number) {
    this.getOne(id);
    this.movies = this.movies.filter((movie) => movie.id !== id);
  }

  update(id: number, updateData: UpdateMovieDto) {
    const movie = this.getOne(id);
    this.deleteOne(id);
    this.movies.push({ ...movie, ...updateData });
  }
}
