import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret = 'SUPER_SECRET_JWT_KEY_PLUTUS';
  private readonly refreshSecret = 'SUPER_SECRET_REFRESH_KEY_PLUTUS';

  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService
  ) {}

  async login(email: string, pass: string) {
    const { data, error } = await this.supabaseService.getClient().auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error || !data.user) {
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu từ Supabase');
    }

    const payload = { sub: data.user.id, email: data.user.email };
    
    return {
      accessToken: this.jwtService.sign(payload, { secret: this.jwtSecret, expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { secret: this.refreshSecret, expiresIn: '7d' })
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: this.refreshSecret });
      const newPayload = { sub: payload.sub, email: payload.email };
      return {
        accessToken: this.jwtService.sign(newPayload, { secret: this.jwtSecret, expiresIn: '15m' }),
        refreshToken: this.jwtService.sign(newPayload, { secret: this.refreshSecret, expiresIn: '7d' })
      };
    } catch (e) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  verifyAccess(token: string) {
    return this.jwtService.verify(token, { secret: this.jwtSecret });
  }
}
