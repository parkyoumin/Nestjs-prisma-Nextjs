import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/application/user.service";
import { User } from "src/user/domain/user.entity";
import { PrismaService } from "src/prisma/prisma.service";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });
});

describe("ProjectController (e2e)", () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let prismaService: PrismaService;
  let accessToken: string;
  let testUser: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    userService = moduleFixture.get<UserService>(UserService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // 1. 테스트 유저 생성
    const userEmail = `e2e-test-${Date.now()}@example.com`;
    testUser = await userService.createUser({
      email: userEmail,
      name: "Test User",
      providerAccountId: "e2e-test-provider-id",
    });

    // 2. 해당 유저로 액세스 토큰 발급
    accessToken = await authService.generateAccessToken(testUser.id.toString());
  });

  afterAll(async () => {
    // 3. 테스트 유저 삭제
    if (testUser) {
      await prismaService.user.delete({ where: { id: testUser.id } });
    }
    await app.close();
  });

  describe("/project (POST)", () => {
    it("유효한 제목으로 프로젝트를 생성하면 201을 반환한다", () => {
      return request(app.getHttpServer())
        .post("/project")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "My E2E Test Project" })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.title).toBe("My E2E Test Project");
          // 생성된 프로젝트 데이터는 다음 테스트를 위해 정리 필요
        });
    });

    it("제목이 없으면 400 에러를 반환한다", () => {
      return request(app.getHttpServer())
        .post("/project")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });

    it("제목이 빈 문자열이면 400 에러를 반환한다", () => {
      return request(app.getHttpServer())
        .post("/project")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "" })
        .expect(400);
    });

    it("제목이 너무 길면 400 에러를 반환한다", () => {
      const longTitle = "a".repeat(101);
      return request(app.getHttpServer())
        .post("/project")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: longTitle })
        .expect(400);
    });

    it("인증 토큰이 없으면 401 에러를 반환한다", () => {
      return request(app.getHttpServer())
        .post("/project")
        .send({ title: "A Project without token" })
        .expect(401);
    });
  });
});
