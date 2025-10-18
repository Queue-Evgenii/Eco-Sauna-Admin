import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { TokenStrategy } from '../token/token.strategy';
import { MediaFile } from 'src/models/entities/media-file.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('TokenService') private readonly tokenService: TokenStrategy,
  ) {}

  @Get()
  findAll(): Promise<MediaFile[]> {
    return this.mediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MediaFile> {
    return this.mediaService.findOne(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuid()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MediaFile> {
    const data: Partial<MediaFile> = {
      directory: 'uploads',
      filename: file.filename,
      size: file.size,
      mime_type: file.mimetype,
      alt_text: file.originalname,
      description: '',
      width: undefined,
      height: undefined,
    };

    return this.mediaService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<MediaFile>,
  ): Promise<MediaFile> {
    return this.mediaService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.mediaService.remove(id);
  }
}
