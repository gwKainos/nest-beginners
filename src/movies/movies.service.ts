import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';
import { safeParseJSON } from '../utils/json.util'; // 유틸리티 함수 import

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(movieData: CreateMovieDto): Promise<Movie> {
    const createdMovie = await this.prisma.movie.create({
      data: {
        title: movieData.title,
        year: movieData.year,
        genres: JSON.stringify(movieData.genres), // 배열을 JSON 문자열로 변환
        isDeleted: false, // 기본값 설정
      },
    });

    return {
      ...createdMovie,
      genres: safeParseJSON<string[]>(createdMovie.genres, []),
    };
  }

  async getAll(): Promise<Movie[]> {
    const movies = await this.prisma.movie.findMany({
      where: { isDeleted: false }, // 삭제되지 않은 영화만 조회
    });

    return movies.map((movie) => ({
      ...movie,
      genres: safeParseJSON<string[]>(movie.genres, []), // 안전한 JSON 파싱
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
      genres: safeParseJSON<string[]>(movie.genres, []), // JSON 문자열을 배열로 변환
    };
  }

  async deleteOne(id: number): Promise<void> {
    const movie = await this.getOne(id); // 존재 여부 확인

    await this.prisma.movie.update({
      where: { id: movie.id },
      data: { isDeleted: true }, // 소프트 삭제 플래그 설정
    });
  }

  async update(id: number, updateData: UpdateMovieDto): Promise<Movie> {
    const movie = await this.getOne(id); // 존재 여부 확인

    const updatedMovie = await this.prisma.movie.update({
      where: { id: movie.id },
      data: {
        title: updateData.title,
        year: updateData.year,
        genres: updateData.genres
          ? JSON.stringify(updateData.genres)
          : undefined,
        updatedAt: new Date(),
      },
    });

    return {
      ...updatedMovie,
      genres: safeParseJSON<string[]>(updatedMovie.genres, []), // JSON 문자열을 배열로 변환
    };
  }
}
