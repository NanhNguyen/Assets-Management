import { SupabaseService } from '../supabase/supabase.service';
export declare class AssetsService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    getAllAssets(): Promise<any[]>;
    getAuditLogs(): Promise<any[]>;
    createAsset(assetData: any): Promise<any>;
    updateAsset(id: string, assetData: any): Promise<any>;
    getAssetHandovers(assetId: string): Promise<any[]>;
    private logAction;
}
