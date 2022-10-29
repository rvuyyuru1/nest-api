import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }
  // for test
  cleanDB() {
    return this.$transaction([
      this.authtoken.deleteMany(),
      this.bookmarks.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
