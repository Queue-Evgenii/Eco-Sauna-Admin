import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMediaFilesTable1760732568031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'media_files',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'directory',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'filename',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'size',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'mime_type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'width',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'height',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'alt_text',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        uniques: [
          {
            name: 'UQ_media_files_directory_filename',
            columnNames: ['directory', 'filename'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('media_files');
  }
}
