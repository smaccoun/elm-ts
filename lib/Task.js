"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var Task_1 = require("fp-ts/lib/Task");
exports.Task = Task_1.Task;
var Option_1 = require("fp-ts/lib/Option");
var Traversable_1 = require("fp-ts/lib/Traversable");
var Array_1 = require("fp-ts/lib/Array");
var sequenceTasks = Traversable_1.sequence(Task_1.task, Array_1.array);
function perform(task, f) {
    return Observable_1.Observable.of(task.map(function (a) { return Option_1.some(f(a)); }));
}
exports.perform = perform;
function sequence(tasks) {
    return sequenceTasks(tasks);
}
exports.sequence = sequence;
function attempt(task, f) {
    return perform(task, f);
}
exports.attempt = attempt;
//# sourceMappingURL=Task.js.map