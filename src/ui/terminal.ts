import chalk from "chalk";

export const terminal = {
  info(message: string): void {
    console.log(chalk.cyan(`> ${message}`));
  },
  warn(message: string): void {
    console.log(chalk.yellow(`> ${message}`));
  },
  error(message: string): void {
    console.error(chalk.red(`> ${message}`));
  },
  write(message: string): void {
    console.log(message);
  }
};
