import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AssetsService {
  constructor(private readonly supabaseService: SupabaseService) {}

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

  async createAsset(assetData: any) {
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
}
