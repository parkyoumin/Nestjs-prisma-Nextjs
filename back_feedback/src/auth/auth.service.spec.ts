import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/application/user.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUser } from "src/types/user.type";
import { User } from "src/user/domain/user.entity";

// UserService와 JwtService의 가짜(Mock) 객체를 생성합니다.
const mockUserService = {
  createUser: jest.fn(),
  findUserByProviderAccountId: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe("AuthService", () => {
  let authService: AuthService;
  let userService: jest.Mocked<typeof mockUserService>;
  let jwtService: jest.Mocked<typeof mockJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("signUp", () => {
    it("새로운 사용자를 성공적으로 생성해야 한다", async () => {
      // Given (준비)
      const createUserData: CreateUser = {
        providerAccountId: "12345",
        email: "test@example.com",
        name: "Test User",
      };

      const expectedUser = new User();
      expectedUser.id = BigInt(1);
      expectedUser.providerAccountId = "12345";
      expectedUser.email = "test@example.com";
      expectedUser.name = "Test User";

      // userService.createUser가 호출되면 expectedUser를 반환하도록 설정
      userService.createUser.mockResolvedValue(expectedUser);

      // When (실행)
      const result = await authService.signUp(createUserData);

      // Then (검증)
      expect(result).toEqual(expectedUser);
      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledWith(createUserData);
    });
  });

  describe("login", () => {
    it("존재하는 사용자로 로그인하면 사용자 정보를 반환해야 한다", async () => {
      // Given
      const providerAccountId = "existing-user";
      const expectedUser = new User();
      expectedUser.providerAccountId = providerAccountId;
      userService.findUserByProviderAccountId.mockResolvedValue(expectedUser);

      // When
      const result = await authService.login(providerAccountId);

      // Then
      expect(result).toEqual(expectedUser);
      expect(userService.findUserByProviderAccountId).toHaveBeenCalledWith(
        providerAccountId,
      );
    });

    it("존재하지 않는 사용자로 로그인하면 NotFoundException을 던져야 한다", async () => {
      // Given
      const providerAccountId = "non-existing-user";
      userService.findUserByProviderAccountId.mockResolvedValue(null);

      // When & Then
      await expect(authService.login(providerAccountId)).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("generateAccessToken", () => {
    it("올바른 payload로 access token을 생성해야 한다", async () => {
      // Given
      const providerAccountId = "test-provider-id";
      const expectedToken = "mock-access-token";
      jwtService.signAsync.mockResolvedValue(expectedToken);

      // When
      const result = await authService.generateAccessToken(providerAccountId);

      // Then
      expect(result).toBe(expectedToken);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { providerAccountId },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: "1h",
        },
      );
    });
  });
});
