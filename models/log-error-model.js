"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogError = void 0;
var LogError = /** @class */ (function () {
    function LogError(props) {
        this.numError = props.numError;
        this.text = props.text;
    }
    LogError.HandleStatus = function (res, log) {
        res.statusMessage = log.text;
        res.status(log.numError).end();
    };
    return LogError;
}());
exports.LogError = LogError;
