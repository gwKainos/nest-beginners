# nest-beginners

```shell
$ sudo npm install -g @nestjs/cli
$ nest new
 : 프로젝트명
 : npm
```

## TDD Start
### 기본 구조 생성
```shell
$ nest g mo movies
$ nest g co movies
$ nest g s movies
```

```shell
$ npm i @nestjs/mapped-types
$ npm i class-validator class-transformer 
```

### Prisma 적용
주의 : .env는 각자가 맞게 수정해서 사용할 것.

1. movie.prisma 파일 생성
2. 기존 데이터 유지하며 마이그레이션
```shell
$ npx prisma migrate deploy --schema=./prisma/movie.prisma --name init
```
3. 기존 데이터 삭제하면서 마이그레이션
```shell
$ npx prisma migrate dev --schema=./prisma/movie.prisma --name init
```
4. Prisma Client 생성
```shell
$ npx prisma generate --schema=movie.prisma
```

### 데이터 생명 주기(Lifecycle) 기반으로 테스트 작성
1. 조회 (getAll, getOne)
2. 생성 (create)
3. 삭제 (deleteOne)
4. 수정 (update)
