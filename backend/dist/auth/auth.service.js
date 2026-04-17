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
            throw new common_1.UnauthorizedException('Sai tài khoản hoặc mật khẩu từ Supabase');
        }
        const payload = { sub: data.user.id, email: data.user.email };
        return {
            accessToken: this.jwtService.sign(payload, { secret: this.jwtSecret, expiresIn: '15m' }),
            refreshToken: this.jwtService.sign(payload, { secret: this.refreshSecret, expiresIn: '7d' })
        };
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token, { secret: this.refreshSecret });
            const newPayload = { sub: payload.sub, email: payload.email };
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map