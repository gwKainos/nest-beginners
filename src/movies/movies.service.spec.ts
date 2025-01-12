import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from "./dto/create-movie.dto";
import { NotFoundException } from "@nestjs/common";

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

  describe('getOne', () => {
    it('should return a movie', () => {
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;
      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('should throw a NotFoundException', () => {
      try {
        service.deleteOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
