import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
// @UseGuards(JwtAuthGuard)
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

  @Post('assets')
  async createAsset(@Body() assetData: any) {
    try {
      const data = await this.assetsService.createAsset(assetData);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
