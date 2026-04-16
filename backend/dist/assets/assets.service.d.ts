import { SupabaseService } from '../supabase/supabase.service';
export declare class AssetsService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    getAllAssets(): Promise<any[]>;
    getAuditLogs(): Promise<any[]>;
}
