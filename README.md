# Auto Music

Монорепо для сайта автозвука: фронтенд на Vue 3 с Options API, backend на NestJS в микросервисной архитектуре и Docker-оркестрацией.

## Стек

- `frontend`: Vue 3, Vue Router, Vite, Options API
- `backend`: NestJS monorepo
- `microservices`: `api-gateway`, `catalog-service`, `content-service`, `users-service`
- `edge`: Nginx как единая входная точка
- `docker`: Docker Compose

## Структура

```text
frontend/              Vue-приложение
backend/               NestJS monorepo
infra/nginx/           конфиг reverse proxy
docker-compose.yml     запуск всей системы
```

## Быстрый старт локально

1. Установить зависимости:

```powershell
npm.cmd install --workspaces
```

2. Запустить фронтенд:

```powershell
npm.cmd --workspace frontend run dev
```

3. В отдельных терминалах поднять backend:

```powershell
npm.cmd --workspace backend run start:gateway
npm.cmd --workspace backend run start:catalog
npm.cmd --workspace backend run start:content
npm.cmd --workspace backend run start:users
```

Фронтенд по умолчанию ожидает API на `http://localhost:3000/api`.

## Запуск через Docker

```powershell
docker compose up --build
```

После запуска приложение будет доступно на `http://localhost`.

## Что реализовано

- Главная страница по Figma-структуре
- Авторизация и регистрация
- Sticky header с тенью при скролле
- Reveal-анимации блоков при появлении в viewport
- Плавные page transitions
- API gateway + 3 микросервиса
- Nginx reverse proxy для фронта и API

