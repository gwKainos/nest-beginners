import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';

// 유틸리티 함수 import

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(movieData: CreateMovieDto): Promise<Movie> {
    const createdMovie = await this.prisma.movie.create({
      data: {
        title: movieData.title,
        year: movieData.year,
        genres: JSON.stringify(movieData.genres), // 배열을 JSON 문자열로 변환
        isDeleted: false,
      },
    });

    return {
      ...createdMovie,
      genres: JSON.parse(createdMovie.genres as string),
    };
  }

  async getAll(): Promise<Movie[]> {
    const movies = await this.prisma.movie.findMany({
      where: { isDeleted: false },
    });

    return movies.map((movie) => ({
      ...movie,
      genres: JSON.parse(movie.genres as string),
    }));
  }

  async getOne(id: number): Promise<Movie> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie || movie.isDeleted) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }

    return {
      ...movie,
      genres: JSON.parse(movie.genres as string),
    };
  }

  async deleteOne(id: number): Promise<void> {
    const movie = await this.getOne(id);

    await this.prisma.movie.update({
      where: { id: movie.id },
      data: { isDeleted: true },
    });
  }

  async update(id: number, updateData: UpdateMovieDto): Promise<Movie> {
    const movie = await this.getOne(id);

    const updatedMovie = await this.prisma.movie.update({
      where: { id: movie.id },
      data: {
        title: updateData.title,
        year: updateData.year,
        genres: updateData.genres
          ? JSON.stringify(updateData.genres)
          : movie.genres,
        updatedAt: new Date(),
      },
    });

    return {
      ...updatedMovie,
      genres: JSON.parse(updatedMovie.genres as string), // Prisma에서 반환된 JSON 값을 문자열로 변환 후 파싱
    };
  }
}
