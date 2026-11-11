import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { BlockListDTO } from './blockListDTO.dto.js';
 
@Controller()
export class AppController {
 
    constructor(private readonly appService: AppService) {}
 
    @Get()
    @Render('index')
    async getBlocklist() {
        return {
            rules: await this.appService.getBlocklist(),
        };
    }
 
    @Post()
    @Render('index')
    async addBlocklist(@Body() body: BlockListDTO) {
 
        const priority = Number(body.priority);
        const mac = String(body.mac ?? '').trim();
        const enabled = String(body.enabled);
        const macRegex = /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/;
 
        if (
            String(body.priority).trim() === '' ||
            !Number.isInteger(priority)
        ) {
            return {
                rules: await this.appService.getBlocklist(),
                error: 'A prioritás egész szám legyen'
            };
        }
 
        if (!macRegex.test(mac)) {
            return {
                rules: await this.appService.getBlocklist(),
                error: 'Hibás MAC-cím'
            };
        }
 
        if (enabled !== 'true' && enabled !== 'false') {
            return {
                rules: await this.appService.getBlocklist(),
                error: 'Hiba'
            };
        }
 
        await this.appService.addBlocklist({
            priority: priority,
            mac: mac,
            enabled: enabled === 'true'
        });
 
        return {
            rules: await this.appService.getBlocklist(),
            success: 'A szabály hozzáadva'
        };
    }
}
