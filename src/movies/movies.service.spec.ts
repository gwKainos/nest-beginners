import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { NotFoundException } from '@nestjs/common';

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
      const movieData: CreateMovieDto = {
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      };

      const createdMovie = service.create(movieData);

      expect(createdMovie).toMatchObject({
        id: expect.any(Number),
        ...movieData,
      });
    });
  });

  describe('getAll', () => {
    it('should return an array', () => {
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });

      const result = service.getAll();
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getOne', () => {
    beforeEach(() => {
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
    });

    it('should return a movie by ID', () => {
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toBe(1);
    });

    it('should throw a NotFoundException if movie not found', () => {
      expect(() => service.getOne(999)).toThrow(NotFoundException);
    });
  });

  describe('deleteOne', () => {
    beforeEach(() => {
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
    });

    it('should delete a movie by ID', () => {
      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;

      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('should throw a NotFoundException if movie not found', () => {
      expect(() => service.deleteOne(999)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
    });

    it('should update a movie by ID', () => {
      const updateData = { title: 'Updated Test Movie' };
      service.update(1, updateData);

      const updatedMovie = service.getOne(1);
      expect(updatedMovie.title).toBe(updateData.title);
    });

    it('should throw a NotFoundException if movie not found', () => {
      expect(() => service.update(999, {})).toThrow(NotFoundException);
    });
  });
});
