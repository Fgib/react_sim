import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('Root')
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Time check' })
  ping() {
    return new Date().toLocaleString();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check', responses: { 200: { description: 'OK' } } })
  healthCheck() {
    return 'OK';
  }

  @Get('files')
  @ApiOperation({ summary: 'Get all files' })
  getFiles() {
    return this.appService.getFiles();
  }
}
