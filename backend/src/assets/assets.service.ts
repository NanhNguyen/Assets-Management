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
}
