import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // 액세스 토큰을 요청 헤더나 쿠키에서 추출합니다.
    const accessToken = request.headers['authorization'] || request.cookies['accessToken'];

    if (!accessToken) {
      return false; // 액세스 토큰이 없는 경우, 요청 거부
    }

    try {
      // 액세스 토큰을 검증합니다.
      const decodedToken = this.jwtService.verify(accessToken);
      // 검증 결과를 요청 객체에 저장합니다.
      request.user = decodedToken; // 요청 핸들러에서 인증된 사용자 정보에 접근할 수 있게 됩니다.
      return true; // 액세스 토큰이 유효한 경우, 요청 허용
    } catch (error) {
      return false; // 액세스 토큰이 유효하지 않은 경우, 요청 거부
    }
  }
}
