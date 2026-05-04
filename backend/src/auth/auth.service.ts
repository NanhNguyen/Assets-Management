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
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu từ hệ thống');
    }

    // Lấy role từ bảng profiles
    const { data: profile, error: profileError } = await this.supabaseService.getClient()
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    // Tạm thời để mặc định là admin để bạn có thể quản lý tài khoản
    const userRole = profile?.role || 'admin';

    const payload = { 
      sub: data.user.id, 
      email: data.user.email,
      role: userRole
    };
    
    return {
      accessToken: this.jwtService.sign(payload, { secret: this.jwtSecret, expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { secret: this.refreshSecret, expiresIn: '7d' }),
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userRole
      }
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: this.refreshSecret });
      const newPayload = { 
        sub: payload.sub, 
        email: payload.email,
        role: payload.role 
      };
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

  async registerByAdmin(adminId: string, userData: { email: string, password: string, fullName: string, role: string }) {
    // Note: Creating user in auth.users requires Service Role Key if done from backend
    // Or Admin usage if using auth.admin API
    const { data, error } = await this.supabaseService.getClient().auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: { full_name: userData.fullName }
    });

    if (error) {
      throw new Error(`Lỗi tạo tài khoản Supabase: ${error.message}`);
    }

    if (data.user) {
      const { error: profileError } = await this.supabaseService.getClient()
        .from('profiles')
        .insert({
          id: data.user.id,
          email: userData.email,
          full_name: userData.fullName,
          role: userData.role
        });

      if (profileError) {
        throw new Error(`Lỗi tạo hồ sơ profile: ${profileError.message}`);
      }
    }

    return { success: true, message: 'Cấp tài khoản thành công', user: data.user };
  }

  async getAllUsers() {
    const { data, error } = await this.supabaseService.getClient()
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Lỗi lấy danh sách nhân sự: ${error.message}`);
    }

    return data;
  }

  async updateUserRole(userId: string, newRole: string) {
    const { error } = await this.supabaseService.getClient()
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      throw new Error(`Lỗi cập nhật quyền: ${error.message}`);
    }

    return { success: true, message: 'Cập nhật quyền thành công' };
  }

  async deleteUser(userId: string) {
    // 1. Xóa trong bảng profiles
    const { error: profileError } = await this.supabaseService.getClient()
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      throw new Error(`Lỗi xóa hồ sơ: ${profileError.message}`);
    }

    // 2. Xóa trong auth.users (requires service role)
    const { error: authError } = await this.supabaseService.getClient().auth.admin.deleteUser(userId);

    if (authError) {
      console.warn(`Cảnh báo: Không thể xóa user trong auth: ${authError.message}`);
    }

    return { success: true, message: 'Đã xóa tài khoản nhân sự' };
  }
}
