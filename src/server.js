import path from 'path';
import chalk from 'chalk';
import config from '../config';
import app from './app';

// eslint-disable-next-line no-console
console.log(chalk.green(`Running on ${chalk.underline(config.env.toUpperCase())} environment`));

// eslint-disable-next-line no-console
console.log(chalk.yellow('Creating server instance...'));

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(chalk.yellow(`Server started on port ${config.port}`));

  // eslint-disable-next-line no-console
  console.log(chalk.yellow(`PID is ${process.pid}`));
});
