import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaFile } from 'src/models/entities/media-file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaFile)
    private readonly productRepository: Repository<MediaFile>,
  ) {}
}
