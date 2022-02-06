"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogError = void 0;
class LogError {
    constructor(props) {
        this.numError = props.numError;
        this.text = props.text;
    }
    static HandleStatus(res, log) {
        res.statusMessage = log.text;
        res.status(log.numError).end();
    }
}
exports.LogError = LogError;
//# sourceMappingURL=log-error-model.js.map