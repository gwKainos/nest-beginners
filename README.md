# nest-beginners

```shell
$ sudo npm install -g @nestjs/cli
$ nest new
 : 프로젝트명
 : npm
```

## 1-0. Overview
흐름 파악
main -> controller -> server

## 1-1. Controller
Express : Router

## 1-2. Services
비즈니스 로직 실행

## 2-0. Movies Controller
```shell
$ nest g co 
 : movies
```

## 2-1. More Routes
:id 아래로 내려갈 경우 id로 인식할 수 있으니 search 위치에 주의할 것.

## 2-2. Movies Service part One
```shell
$ nest g s 
 : movies
```

## 2-3. Movies Service part Two
삭제 코드에 주의

## 2-4. DTOs and Validation part One
```shell
$ npm i class-validator class-transformer 
```

### ValidationPipe
https://docs.nestjs.com/techniques/validation
- 참조 라이브러리(class-transformer, class-validator)
 : 라우터나 컨트롤러에 도달하기 전에 요청의 JSON body를 클래스의 인스턴스로 변환한 뒤에 검증

- 적용 방법 두가지
 : main에 app 인스턴스 생성 시 Global pipe로 등록
 : app.module에 APP_PIPE 라는 Provider로 등록 (의존성 주입을 활용할 수 있다는 장점)

- 주요 옵션
 : whitelist: true는 들어오는 데이터에서 유효하지 않은 속성을 자동으로 제거
 : transform: true는 들어오는 데이터 자동 형변환
 : forbidNonWhitelisted: true는 데코레이터를 사용하지 않는 값은 요청 불가

## 2-5. DTOs and Validation part Two
```shell
$ npm i @nestjs/mapped-types
```
- update dto는 extends PartialType(CreateMovieDto) 방식 사용

## 2-6. Modules and Dependency Injection
```shell
$ nest g mo
 : movies
 
$ nest g co
 : app
```

## 2-7. Express on NestJS
NestJS는 플랫폼으로 Express와 Fastify를 지원(기본 : Express)

## 3-0. Introduction to Testing in Nest

## 3-1. Your first Unit Test

## 3-2. Testing getAll and getOne

## 3-3. Testing delete and create