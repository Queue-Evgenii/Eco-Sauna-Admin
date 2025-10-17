import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaFile } from 'src/models/entities/media-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaFile])],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
