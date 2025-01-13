import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let prismaService: Partial<PrismaService>;

  const testMovieData: CreateMovieDto = {
    title: '이상한 나라의 수학자',
    year: 2022,
    genres: ['힐링', '감명을 주는', '청춘'],
  };

  const mockMovie = {
    id: 1,
    ...testMovieData,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaService = {
      movie: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  describe('create', () => {
    it('should create a movie', async () => {
      jest.spyOn(prismaService.movie!, 'create').mockResolvedValue(mockMovie);

      const createdMovie = await service.create(testMovieData);

      expect(createdMovie).toMatchObject({
        id: 1,
        ...testMovieData,
      });

      // 내부 데이터에 저장되었는지 확인
      expect(prismaService.movie!.create).toHaveBeenCalledWith({
        data: testMovieData,
      });
    });
  });

  describe('getAll', () => {
    it('should return an empty array if no movies exist', async () => {
      const result = await service.getAll();
      expect(result).toEqual([]);
    });

    it('should return an array with all movies', async () => {
      service.create(testMovieData);

      const result = await service.getAll();
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

    it('should delete a movie by ID', async () => {
      const beforeDelete = (await service.getAll()).length;
      service.deleteOne(1);
      const afterDelete = (await service.getAll()).length;

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
