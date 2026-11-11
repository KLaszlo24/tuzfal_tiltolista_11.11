import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';
import { Tuzfal } from './tuzfal.js';
import { BlockListDTO } from './blockListDTO.dto.js';
 
const mysqlConnection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test1'
});
 
@Injectable()
export class AppService {
 
    async getBlocklist(): Promise<Tuzfal[]> {
        const [results] = await mysqlConnection.execute(
            'SELECT * FROM blocklist ORDER BY priority ASC'
        );
 
        return (results as any[]).map((item) => ({
            id: item.id,
            priority: item.priority,
            mac: item.mac,
            enabled: Boolean(item.enabled)
        }));
    }
 
    async addBlocklist(body: BlockListDTO) {
        const [results] = await mysqlConnection.execute(
            'INSERT INTO blocklist (priority, mac, enabled) VALUES (?, ?, ?)',
            [body.priority, body.mac, body.enabled]
        );
 
        return results;
    }
}
