# Ticketing

### Documentation
#### Directory Structure
Each module will be placed under `src/modules` directory. As a rule of thumb, split modules into small chunks. All public API should be exposed via `index.js`, even there is no limitation in NodeJS, it is considered best practice as it will prevent us to import something unknown and prevent tightly-coupled modules. Think the `index.js` as a gateway to exchange things.

Example:

```js
// src/modules/location/index.js
import * as model from './model';
export model;
```

```js
// src/modules/event.js
import { model } from '../location';

class Event {
  static id: Int;
  static location: model.Location;
}
```

### Installation
- `yarn install` Install dependencies

#### Configuration
Base configuration file is located inside `/config` directory, the `default.js` will be overridden by the local configuration. Local configuration is excluded from the repository and depends on the `NODE_ENV` value. For example, in development environment, the local config file should be `development.js`.

You can run this in your terminal:

`cp config/local.example.js config/local.js`

OR for development:

`cp config/local.example.js config/development.local.js`

OR

`cp config/local.example.js config/development.js`

OR for production:

`cp config/local.example.js config/production.local.js`

OR

`cp config/local.example.js config/production.js`

Filled the value based on your configuration, and it will be overrided by `default.js` values if you dont set yet. Click [this](https://github.com/lorenwest/node-config), for more details about configuration.

#### Migrations & Seed
- To create new migration script, use `yarn sequelize migration:generate -- --name {NAME}`
- To run the migration script, `yarn sequelize db:migrate`
  * If you wish to undo most recent migration: `yarn sequelize db:migrate:undo`
  * If you wish to undo all migrations: `yarn sequelize db:migrate:undo:all`
  * If you wish to undo specific migration: `yarn sequelize db:migrate:undo:all -- --to {NAME}`
- To create new seed, use `yarn sequelize seed:generate -- --name {NAME}`
- To runing the seeds, use `yarn sequelize db:seed:all`
  * If you wish to undo most recent seed: `yarn sequelize db:seed:undo`
  * If you wish to undo all seeds: `yarn sequelize db:seed:undo:all`

#### CLI Commands
Here's list of commands you can use:
- `yarn start` run app server
- `yarn lint` run es lint

##### CHANGELOG
- Add `res.API.error()` and `res.API.success()` as API responder
- All model import could be directly imported
- Migrate to sequelize
- Add request headers and response body to log
- Implement messages dictionary, please look in location module
