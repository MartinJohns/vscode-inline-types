import chalk from 'chalk';

function getTimestamp(): string {
    const date = new Date();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const milliSeconds = ('0000' + date.getMilliseconds()).slice(-4);
    return chalk.yellowBright(`[${hours}:${minutes}:${seconds}.${milliSeconds}]`);
}

function log(message: string, timestamped: boolean = true): void {
    const timestamp = timestamped ? `${getTimestamp()} ` : '';
    console.log(`${timestamp}${message}`);
}

export function error(message: string): void {
    log(chalk.redBright(message));
}

export function info(message: string): void {
    log(chalk.greenBright(message));
}
