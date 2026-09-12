import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });
  }

  async checkHealth() {
    const startTime = process.uptime();

    // Check database
    let database: 'connected' | 'disconnected' = 'disconnected';
    try {
      const isHealthy = await this.prisma.isHealthy();
      database = isHealthy ? 'connected' : 'disconnected';
    } catch (error) {
      this.logger.warn('Database health check failed', error);
    }

    // Check Redis
    let redis: 'connected' | 'disconnected' = 'disconnected';
    try {
      await this.redis.connect().catch(() => {});
      const pong = await this.redis.ping();
      redis = pong === 'PONG' ? 'connected' : 'disconnected';
    } catch (error) {
      this.logger.warn('Redis health check failed', error);
    }

    const allHealthy = database === 'connected' && redis === 'connected';

    return {
      status: allHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(startTime),
      database,
      redis,
    };
  }
}
