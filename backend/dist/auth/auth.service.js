"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const supabase_service_1 = require("../supabase/supabase.service");
let AuthService = class AuthService {
    jwtService;
    supabaseService;
    jwtSecret = 'SUPER_SECRET_JWT_KEY_PLUTUS';
    refreshSecret = 'SUPER_SECRET_REFRESH_KEY_PLUTUS';
    constructor(jwtService, supabaseService) {
        this.jwtService = jwtService;
        this.supabaseService = supabaseService;
    }
    async login(email, pass) {
        const { data, error } = await this.supabaseService.getClient().auth.signInWithPassword({
            email,
            password: pass,
        });
        if (error || !data.user) {
            throw new common_1.UnauthorizedException('Sai tài khoản hoặc mật khẩu từ hệ thống');
        }
        const { data: profile, error: profileError } = await this.supabaseService.getClient()
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
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
    async refreshToken(token) {
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
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }
    }
    verifyAccess(token) {
        return this.jwtService.verify(token, { secret: this.jwtSecret });
    }
    async registerByAdmin(adminId, userData) {
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
    async updateUserRole(userId, newRole) {
        const { error } = await this.supabaseService.getClient()
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);
        if (error) {
            throw new Error(`Lỗi cập nhật quyền: ${error.message}`);
        }
        return { success: true, message: 'Cập nhật quyền thành công' };
    }
    async deleteUser(userId) {
        const { error: profileError } = await this.supabaseService.getClient()
            .from('profiles')
            .delete()
            .eq('id', userId);
        if (profileError) {
            throw new Error(`Lỗi xóa hồ sơ: ${profileError.message}`);
        }
        const { error: authError } = await this.supabaseService.getClient().auth.admin.deleteUser(userId);
        if (authError) {
            console.warn(`Cảnh báo: Không thể xóa user trong auth: ${authError.message}`);
        }
        return { success: true, message: 'Đã xóa tài khoản nhân sự' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map