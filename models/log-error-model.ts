export interface LogErrorProps {
    numError: number;
    text: string;
}

export class LogError implements LogErrorProps {
    numError: number;
    text: string;

    constructor(props: LogErrorProps) {
        this.numError = props.numError;
        this.text = props.text;
    }

    static HandleStatus(res: any, log: LogError) {
        res.statusMessage = log.text
        res.status(log.numError).end();
    }
}