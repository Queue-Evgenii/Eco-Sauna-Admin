# Eco Sauna Admin

## Development

**Start**
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

**Stop**
```bash
docker compose -f docker-compose.dev.yml down
```

**Services**
| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:5173       |
| Backend   | http://localhost:3000       |
| pgAdmin   | http://localhost:8020       |
| MailHog   | http://localhost:8025       |

**Database migrations** (run inside the backend container)
```bash
# Create
docker exec -it eco-sauna-backend-1 npm run migration:create ./src/migrations/<name>

# Apply
docker exec -it eco-sauna-backend-1 npm run migration:run

# Revert
docker exec -it eco-sauna-backend-1 npm run migration:revert
```

---

## Production

**Requirements:** `.env` file with all variables from `.env.example` plus:
```env
POSTGRES_HOST=postgres
SEED_USER_EMAIL=your@email.com
SEED_USER_PASSWORD=your-strong-password
VITE_API_URL=
```

**Build & start**
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

**Stop**
```bash
docker compose -f docker-compose.prod.yml down
```

**First deploy � run migrations then seed the initial user**
```bash
docker exec -it eco-sauna-admin-backend-1 npm run migration:run:prod
docker exec -it eco-sauna-admin-backend-1 npm run seed:prod
```

**Subsequent deploys**
```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

**Uploaded files** are stored on the host at `./backend/uploads/` and bind-mounted into the container � they persist across rebuilds.
