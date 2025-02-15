import chalk from "chalk";

export const logger = {
	log: (...args: unknown[]) => {
		console.log(chalk.gray(...args));
	},
	info: (...args: unknown[]) => {
		console.log(chalk.blue(...args));
	},
	error: (...args: unknown[]) => {
		console.log(chalk.red(...args));
	},
	warn: (...args: unknown[]) => {
		console.log(chalk.bgYellow(...args));
	},
	success: (...args: unknown[]) => {
		console.log(chalk.bgGreen(...args));
	},
};
