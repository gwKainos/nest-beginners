import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from "./dto/create-movie.dto";

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  describe('create', () => {
    it('should create a movie', () => {
      const createdMovie: CreateMovieDto = service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });

      // 반환된 객체 자체에 대한 검증
      expect(createdMovie).toBeDefined();
      expect(createdMovie.title).toBe('Test Movie');
      expect(createdMovie.genres).toContain('test');
      expect(createdMovie.year).toBe(2000);
    });
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });
});
