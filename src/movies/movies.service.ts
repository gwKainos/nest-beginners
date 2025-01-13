import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';
import { safeParseJSON } from '../utils/json.util'; // 유틸리티 함수 import

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  private movies: Movie[] = [];

  create(movieData: CreateMovieDto): Movie {
    // 새 Movie 객체를 변수에 담는다
    const newMovie: Movie = {
      id: this.movies.length + 1,
      ...movieData,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 내부 배열에 넣고
    this.movies.push(newMovie);

    // 새로 생성된 객체 자체를 반환
    return newMovie;
  }

  async getAll(): Promise<Movie[]> {
    const movies = await this.prisma.movie.findMany({
      where: { isDeleted: false },
    });

    return movies.map((movie) => ({
      ...movie,
      genres: safeParseJSON<string[]>(movie.genres, []), // 안전한 JSON 파싱
    }));
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

  update(id: number, updateData: UpdateMovieDto): Movie {
    const movie = this.getOne(id);
    Object.assign(movie, updateData);
    return movie;
  }
}
