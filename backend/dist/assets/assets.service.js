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
                handover_date: assetData.handoverDate,
                handover_minutes_no: assetData.handoverMinutesNo,
                vendor: assetData.vendor,
                warranty_period: assetData.warrantyPeriod,
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
        const newAsset = data[0];
        this.logAction(newAsset.id, 'create', `Tạo mới tài sản: ${newAsset.name} (${newAsset.code})`, newAsset.name, newAsset.code)
            .catch(err => console.error('Background logging failed:', err));
        if (newAsset.assigned_user) {
            this.supabaseService.getClient().from('asset_handovers').insert([{
                    asset_id: newAsset.id,
                    assigned_user: newAsset.assigned_user,
                    assigned_date: new Date().toISOString()
                }]).then();
        }
        return newAsset;
    }
    async updateAsset(id, assetData) {
        const oldAssetRes = await this.supabaseService.getClient().from('assets').select('assigned_user').eq('id', id).single();
        const oldUser = oldAssetRes.data?.assigned_user;
        const { data, error } = await this.supabaseService
            .getClient()
            .from('assets')
            .update({
            code: assetData.code,
            name: assetData.name,
            category: assetData.category,
            group_name: assetData.group_name,
            assigned_user: assetData.user,
            department: assetData.department,
            position: assetData.position,
            status: assetData.status,
            price: Number(assetData.price),
            purchase_date: assetData.purchaseDate,
            handover_date: assetData.handoverDate,
            handover_minutes_no: assetData.handoverMinutesNo,
            vendor: assetData.vendor,
            warranty_period: assetData.warrantyPeriod,
            depreciation_months: assetData.depreciation_months,
            notes: assetData.notes,
        })
            .eq('id', id)
            .select();
        if (error) {
            throw new Error(error.message);
        }
        if (!data || data.length === 0) {
            return null;
        }
        const updatedAsset = data[0];
        const newUser = assetData.user || null;
        if (oldUser !== newUser) {
            if (oldUser) {
                await this.supabaseService.getClient().from('asset_handovers')
                    .update({ return_date: new Date().toISOString() })
                    .eq('asset_id', id)
                    .eq('assigned_user', oldUser)
                    .is('return_date', null);
            }
            if (newUser) {
                await this.supabaseService.getClient().from('asset_handovers')
                    .insert([{
                        asset_id: id,
                        assigned_user: newUser,
                        assigned_date: new Date().toISOString()
                    }]);
            }
        }
        this.logAction(id, 'edit', `Cập nhật thông tin tài sản: ${updatedAsset.name}. Trạng thái: ${updatedAsset.status}`, updatedAsset.name, updatedAsset.code)
            .catch(err => console.error('Background logging failed:', err));
        return updatedAsset;
    }
    async getAssetHandovers(assetId) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('asset_handovers')
            .select('*')
            .eq('asset_id', assetId)
            .order('assigned_date', { ascending: false });
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async logAction(assetId, action, description, assetName, assetCode) {
        try {
            const logEntry = {
                asset_id: assetId,
                action,
                description,
                asset_name: assetName,
                asset_code: assetCode,
                user_email: 'admin@ricasso.io.vn',
                created_at: new Date().toISOString()
            };
            await this.supabaseService
                .getClient()
                .from('audit_logs')
                .insert([logEntry]);
        }
        catch (e) {
            console.error('Failed to log action:', e);
        }
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map