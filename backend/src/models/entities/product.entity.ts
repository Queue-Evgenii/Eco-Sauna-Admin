import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MediaFile } from './media-file.entity';
import { ProductGallery } from './product-gallery.entity';
import { ProductPrice } from './product-prices.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  area?: number;

  @Column({ type: 'int', nullable: true })
  capacity?: number;

  @Column({ type: 'int', nullable: true })
  max_temperature?: number;

  @ManyToOne(() => MediaFile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'image_id' })
  image?: MediaFile;

  @OneToMany(() => ProductGallery, (gallery) => gallery.product)
  gallery?: ProductGallery[];

  @OneToMany(() => ProductPrice, (price) => price.product)
  prices?: ProductPrice[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
