import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './models/entities/user.entity';

config();

const email = process.env.SEED_USER_EMAIL;
const password = process.env.SEED_USER_PASSWORD;

if (!email || !password) {
  console.error('SEED_USER_EMAIL and SEED_USER_PASSWORD must be set in the environment.');
  process.exit(1);
}

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();

  const repo = dataSource.getRepository(User);
  const existing = await repo.findOne({ where: { email } });

  if (existing) {
    console.log(`User "${email}" already exists. Skipping.`);
  } else {
    const hashed = await bcrypt.hash(password, 10);
    await repo.save(repo.create({ email, password: hashed }));
    console.log(`User "${email}" created.`);
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
