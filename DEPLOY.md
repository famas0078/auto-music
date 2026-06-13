# Auto Music deployment

## Ports

- frontend: `3008`
- backend: `3108`
- postgres: `3208`

## Server path

- `/web/auto-music`

## Start

```bash
cp .env.example .env
docker-compose -f docker-compose.server.yml up -d --build
docker-compose -f docker-compose.server.yml ps
docker-compose -f docker-compose.server.yml logs -f edge
docker-compose -f docker-compose.server.yml logs -f api-gateway
```

## Check

```bash
curl -I http://127.0.0.1:3008
curl http://127.0.0.1:3108/api/home
```

## Notes

- browser traffic goes to the `edge` nginx container on port `3008`
- `edge` proxies `/api` to `api-gateway`
- `users-service` creates the PostgreSQL schema automatically on first start
