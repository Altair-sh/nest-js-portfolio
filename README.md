# NestJS portfolio
Web API that serves my resume data

## Technology stack
- **TypeScript** - programming language of the project
- **NestJS** - HTTP server framework with dependency injection
- **GraphQL** - API query language to specify which parts of data to get from server
- **Apollo Server** - GraphQL server, serves Apollo Sandbox on `/graphql`
- **PostgreSQL** - database backend
- **Prisma** - database client
- **Docker** - builds and runs the app and database in containers
- **vitest**, **supertest** - unit and end to end tests
- **oxlint** - static code analysis
- **prettier** -  and code formatting

## Running deployments
- <img src="https://cdn.simpleicons.org/railway/000000/ffffff" height="16"> [**Railway**](https://railway.com/) - https://nest-js-portfolio.up.railway.app/

- <img src="https://cdn.simpleicons.org/render/000000/ffffff" height="16"> [**Render**](https://render.com/) - https://nest-js-portfolio.onrender.com/

## Install dependencies
```sh
npm ci
```

## Build and run in production
### In docker
```sh
docker compose up -d
```
Open http://localhost:3000/graphql

Docker container ignores `.env`, define variables in `docker-compose.yml` if you need.
Dockerfile runs db:migrate and db:seed before each run.

### No docker
Define env variable `DATABASE_URL` (may use `.env` file)
```sh
npm run build
node --enable-source-maps dist/main.js
```
Open http://localhost:3000/graphql

### Deployment on Railway
1. go to https://railway.com
2. click **new project** -> **deploy from GitHub**.
   Railway finds the `Dockerfile` and builds the app. The first deploy may fail because there is no database yet.
3. In the project click **create** -> **database** -> **PostgreSQL**.
4. In the project click the app service -> **variables**
6. Click **new variable** and enter:
    - **Name:** `DATABASE_URL`
    - **Value:** `${{Postgres.DATABASE_URL}}`
7. Save and deploy. On start the container creates the tables and fills them from `prisma/seed.ts`.
8. In the app service open **Settings** -> **Networking** -> **Generate Domain**.
9. Open `https://<domain>/graphql` to see Apollo Sandbox.

### Deployment on Render
1. go to https://render.com
2. click **new** -> **Postgres**, choose a name and region, click **create database**.
3. On the database page click **connect** -> **internal** and copy the **Internal Database URL**.
4. Click **new** -> **web service** -> select the GitHub repository.
   Render finds the `Dockerfile` and sets language to **Docker**.
5. Choose the same region as the database, so the internal URL works.
6. In **environment variables** add:
    - **Name:** `DATABASE_URL`
    - **Value:** the Internal Database URL from step 3
7. Click **deploy web service**. On start the container creates the tables and fills them from `prisma/seed.ts`.
8. Open `https://<service-name>.onrender.com/graphql` to see Apollo Sandbox.

On the free plan the app sleeps after 15 minutes without requests, so the first request after that takes about a minute. The free database is deleted after 30 days.


## Run in development mode
```sh
cp .env.example .env
docker compose up -d db
# create (or update) table layout in DB
npm run db:migrate
# erase DB and refill from prisma/seed.ts
npm run db:seed
# run app with autoreload on file change
npm run start:dev
```
Open http://localhost:3000/graphql

## Tests
```sh
# unit tests (src/**/*.spec.ts)
npm run test
# end to end tests (test/*.e2e-spec.ts)
npm run test:e2e
# calculate test coverage for each code line
npm run test:cov
```
