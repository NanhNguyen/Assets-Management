import { Controller, Get } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('api')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('assets')
  async getAssets() {
    try {
      const data = await this.assetsService.getAllAssets();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Get('audit-logs')
  async getAuditLogs() {
    try {
      const data = await this.assetsService.getAuditLogs();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
