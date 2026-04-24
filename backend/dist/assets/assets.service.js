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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let AssetsService = class AssetsService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getAllAssets() {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('assets')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getAuditLogs() {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async createAsset(assetData) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('assets')
            .insert([
            {
                code: assetData.code,
                name: assetData.name,
                category: assetData.category,
                group_name: assetData.group_name,
                manufacturer: assetData.manufacturer,
                assigned_user: assetData.user,
                department: assetData.department,
                position: assetData.position,
                status: assetData.status || 'active',
                price: Number(assetData.price),
                purchase_date: assetData.purchaseDate,
                vendor: assetData.vendor,
                warranty_end: assetData.warrantyEnd,
                depreciation_months: assetData.depreciation_months,
                notes: assetData.notes,
                icon: assetData.icon,
                icon_color: assetData.iconColor,
            },
        ])
            .select();
        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map