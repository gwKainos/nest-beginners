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

  async create(movieData: CreateMovieDto): Promise<Movie> {
    return this.prisma.movie.create({
      data: {
        title: movieData.title,
        year: movieData.year,
        genres: movieData.genres,
      },
    });
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
