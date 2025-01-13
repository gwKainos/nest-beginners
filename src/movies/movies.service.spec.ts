import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  const testMovieData: CreateMovieDto = {
    title: '이상한 나라의 수학자',
    year: 2022,
    genres: ['힐링', '감명을 주는', '청춘'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);

    // 데이터 초기화
    (service as any).movies = [];
  });

  describe('create', () => {
    it('should create a movie', () => {
      const createdMovie = service.create(testMovieData);

      expect(createdMovie).toMatchObject({
        id: expect.any(Number),
        ...testMovieData,
      });

      // 내부 데이터에 저장되었는지 확인
      const allMovies = service.getAll();
      expect(allMovies).toContainEqual(createdMovie);
    });
  });

  describe('getAll', () => {
    it('should return an empty array if no movies exist', () => {
      const result = service.getAll();
      expect(result).toEqual([]);
    });

    it('should return an array with all movies', () => {
      service.create(testMovieData);

      const result = service.getAll();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(testMovieData);
    });
  });

  describe('getOne', () => {
    beforeEach(() => {
      service.create(testMovieData);
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
      service.create(testMovieData);
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
      service.create(testMovieData);
    });

    it('should update a movie by ID', () => {
      const updateData = { title: 'Updated Test Movie' };
      service.update(1, updateData);

      const updatedMovie = service.getOne(1);
      expect(updatedMovie.title).toBe(updateData.title);
    });

    it('should retain original data if no update fields are provided', () => {
      service.update(1, {});
      const movie = service.getOne(1);

      expect(movie).toMatchObject(testMovieData);
    });

    it('should throw a NotFoundException if movie not found', () => {
      expect(() => service.update(999, {})).toThrow(NotFoundException);
    });
  });
});
