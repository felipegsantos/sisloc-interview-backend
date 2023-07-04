## Installation

Up the containers docker (PostgreSQL and Redis)
```bash
docker run -p 5432:5432  --name postgresql -e POSTGRES_PASSWORD=root -d postgres
docker run -p 6379:6379 --name redis -d redis redis-server --save 60 1 --loglevel warning
```

PS.: Run the postgres image in root of project for creation volume pgdata of them


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