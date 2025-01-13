import { JsonValue } from '@prisma/client/runtime/library';

export interface Movie {
  id: number;
  title: string;
  year: number;
  genres: JsonValue;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
