import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaFile } from 'src/models/entities/media-file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaFile)
    private readonly mediaRepository: Repository<MediaFile>,
  ) {}

  async findAll(): Promise<MediaFile[]> {
    return this.mediaRepository.find();
  }

  async findOne(id: number): Promise<MediaFile> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException(`Media file #${id} not found`);
    return media;
  }

  async create(data: Partial<MediaFile>): Promise<MediaFile> {
    const newFile = this.mediaRepository.create(data);
    return this.mediaRepository.save(newFile);
  }

  async update(id: number, data: Partial<MediaFile>): Promise<MediaFile> {
    const media = await this.findOne(id);
    Object.assign(media, data);
    return this.mediaRepository.save(media);
  }

  async remove(id: number): Promise<void> {
    const media = await this.findOne(id);
    await this.mediaRepository.remove(media);
  }
}
