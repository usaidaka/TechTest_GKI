# Technical Test

This is monorepo contain frontend project using ReactJS and backend project using ExpressJS.

## How to do first set up

### initial instal

- clone this repository
- npm install

#### env set up

- set up all .env require form. you can check on .env.exp
- you can use my SMTP account or you can use your own

### database preparation & backend initialization

#### initialization schema

- go to projects/server/src
- create schema by doing sequelize-cli db:create (don't forget to fill the .env in # config ORM form)
- migrate the table by doing : sequelize-cli db:migrate
- seed all the seeder by doing : sequelize-cli db:seed:all

#### Techtest-gki.zip

- you can extract Techtest-gki.zip folder
- i attached a postman for backend checking if require
- i attached a database export as require

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

For API, you can access it in [http://localhost:8000/api](http://localhost:8000/api).

The page will reload if you make edits.

### `npm run clean`

Remove `node_modules` folder from all project.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run serve`

Runs the app in the production mode.

### `npm run client`

Run command on client project.

### `npm run install:client`

Install dependency in client project. Use `npm install:client:dev` for dev dependencies.

### `npm run server`

Run command on server project.

### `npm run install:server`

Install dependency in server project. Use `npm install:server:dev` for dev dependencies.
