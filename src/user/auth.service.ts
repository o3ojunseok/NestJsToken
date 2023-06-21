import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "./user.repository";
import { randomBytes } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async generateAccessToken(username: string): Promise<string> {
    const payload = { username };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // Access Token 만료 시간 설정
    return accessToken;
  }

  async generateRefreshToken(username: string): Promise<string> {
    const refreshToken = randomBytes(64).toString("hex");
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 14); // 2주(14일) 후 만료
    const user = await this.userRepository.findOneUserName(username);
    user.refresh_token = refreshToken;
    user.refresh_token_expires_at = expirationDate;
    await this.userRepository.save(user);
    return refreshToken;
  }
  
  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token); // 토큰 검증
      const user = await this.userRepository.findOne(payload.username); // 토큰에 포함된 사용자 정보 조회
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}