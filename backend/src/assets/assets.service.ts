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
      
    // Record initial handover if assigned
    if (newAsset.assigned_user) {
      this.supabaseService.getClient().from('asset_handovers').insert([{
        asset_id: newAsset.id,
        assigned_user: newAsset.assigned_user,
        assigned_date: new Date().toISOString()
      }]).then();
    }
    
    return newAsset;
  }

  async updateAsset(id: string, assetData: any) {
    // Get old asset to check for handover changes
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
    
    // Handover tracking logic
    const newUser = assetData.user || null;
    if (oldUser !== newUser) {
      if (oldUser) {
        // End previous assignment
        await this.supabaseService.getClient().from('asset_handovers')
          .update({ return_date: new Date().toISOString() })
          .eq('asset_id', id)
          .eq('assigned_user', oldUser)
          .is('return_date', null);
      }
      if (newUser) {
        // Start new assignment
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

  async getAssetHandovers(assetId: string) {
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

  private async logAction(assetId: string, action: string, description: string, assetName?: string, assetCode?: string) {
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
    } catch (e) {
      console.error('Failed to log action:', e);
    }
  }
}
