import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('media_files')
@Unique('UQ_media_files_directory_filename', ['directory', 'filename'])
export class MediaFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  directory: string;

  @Column({ type: 'varchar' })
  filename: string;

  @Column({ type: 'int', nullable: true })
  size?: number;

  @Column({ type: 'varchar' })
  mime_type: string;

  @Column({ type: 'int', nullable: true })
  width?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  @Column({ type: 'varchar' })
  alt_text: string;

  @Column({ type: 'varchar' })
  description: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
