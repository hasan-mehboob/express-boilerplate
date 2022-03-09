# Postgres Express boilerplate

## Table of Contents
- [Installation](#installation)
- [Clone](#clone)
- [Branch](#branch)
- [Commands](#commands)
- [Tech Stack](#tech)
- [Tree Structure](#tree)

## Installation
```bash
$ yarn
```
## clone
```bash
$ git clone https://github.com/frizhub-repo/express-boilerplate.git
```
## branch
```bash
$ git checkout feature/postgres-boilerplate
```
## Commands

commands  | Description
------------- | -------------
yarn run start |  Start server.
yarn run sequelize migration:create --name add-user  | Create Migration name of add-user in migrations Folder.
yarn run model:generate --name="test" --attributes=name:string  |  Generate model and its migeration.
yarn run migrate:undo |  Revert last running migration
yarn run migrate:undo:all |  Revert all migrations
yarn run migrate |  Run pending migrations  for development use :dev and for production use :prod. e.g `yarn run migrate:dev`

## tech

- [Node js] -evented I/O for the backend
- [Express js] - fast node.js network app framework
- [Sequelize] - Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.
- [Postgres] - Open Source Relational Database

# project tree
```
.gitignore
.sequelizerc
README.md
bin
   |-- www
bootstrap.js
config
   |-- data_constraints.js
   |-- db
   |   |-- database.json
   |   |-- index.js
   |-- messages.js
   |-- strategies
   |   |-- facebook.strategy.passport.js
   |   |-- google.strategy.passport.js
   |   |-- index.js
   |   |-- jwt.strategy.passport.js
   |   |-- local.strategy.passport.js
   |   |-- twitter.strategy.passport.js
generate-types.js
jsconfig.json
package.json
src
   |-- global-package.js
   |-- helpers
   |   |-- index.js
   |-- libs
   |   |-- email_service.lib.js
   |   |-- index.js
   |-- middlewares
   |   |-- index.js
   |   |-- jwt.middleware.js
   |-- migrations
   |   |-- 20220303184959-create-users.js
   |-- modules
   |   |-- index.js
   |   |-- users
   |   |   |-- actions
   |   |   |   |-- user.auth.action.js
   |   |   |-- routes
   |   |   |   |-- v1
   |   |   |   |   |-- user.route.js
   |   |   |-- user.validator.js
   |-- schemas
   |   |-- index.js
   |   |-- users.js
   |-- server.js
   |-- services
   |   |-- auth.service.js
   |   |-- crud.service.js
   |   |-- index.js
   |-- utils
   |   |-- globalFile.util.js
   |   |-- hash.util.js
   |   |-- index.js
   |   |-- random.util.js
```



