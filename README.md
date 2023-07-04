## Preparing environment

Up the containers docker (PostgreSQL and Redis)
```bash
docker run -p 5432:5432  --name postgresql -e POSTGRES_PASSWORD=root -d postgres
docker run -p 6379:6379 --name redis -d redis redis-server --save 60 1 --loglevel warning
```

## Database creation

1. Access your database via host/port using DBeaver or whatever.
2. Import for your database manager software the schema file that is in root of project (sql/schema.sql)
3. has a .env.example, rename the file for .env

The database name is sisloc-db for default.

PS.: Run the postgres image in root of project for creation volume pgdata of them

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
