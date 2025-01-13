import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly genres: string[];
}
