import { Test } from "@nestjs/testing";
import { UserService } from "./user.service";
import { IUserRepository } from "../domain/user.repository";
import { User } from "../domain/user.entity";

// IUserRepository의 가짜(Mock) 객체를 생성합니다.
// 실제 DB에 접근하는 대신, 우리가 원하는 값을 반환하도록 흉내냅니다.
const mockUserRepository = () => ({
  findUserByProviderAccountId: jest.fn(),
});

describe("UserService", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: "IUserRepository",
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    userService = module.get(UserService);
    userRepository = module.get("IUserRepository");
  });

  describe("findUserByProviderAccountId", () => {
    it("유효한 providerAccountId로 사용자를 성공적으로 찾아야 한다", async () => {
      // Given (준비)
      const providerAccountId = "12345";
      const expectedUser = new User();
      expectedUser.id = BigInt(1);
      expectedUser.email = "test@example.com";
      expectedUser.providerAccountId = providerAccountId;

      // userRepository가 이 메서드로 호출되면 expectedUser를 반환하도록 설정
      userRepository.findUserByProviderAccountId.mockResolvedValue(
        expectedUser,
      );

      // When (실행)
      const result =
        await userService.findUserByProviderAccountId(providerAccountId);

      // Then (검증)
      expect(result).toEqual(expectedUser);
      expect(result.email).toBe("test@example.com");
      // userRepository의 findUserByProviderAccountId가 정확히 1번 호출되었는지 확인
      expect(userRepository.findUserByProviderAccountId).toHaveBeenCalledTimes(
        1,
      );
      // 어떤 인자로 호출되었는지도 확인
      expect(userRepository.findUserByProviderAccountId).toHaveBeenCalledWith(
        providerAccountId,
      );
    });

    it("존재하지 않는 providerAccountId의 경우 null을 반환해야 한다", async () => {
      // Given
      const providerAccountId = "non-existent-id";
      userRepository.findUserByProviderAccountId.mockResolvedValue(null);

      // When & Then
      await expect(
        userService.findUserByProviderAccountId(providerAccountId),
      ).rejects.toThrow("User not found");
    });
  });
});
