import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/take';
import { Cmd } from './Cmd';
import { Sub } from './Sub';
import * as html from './Html';
import { Location as HistoryLocation } from 'history';
export declare type Location = HistoryLocation;
export declare function push<msg>(url: string): Cmd<msg>;
export declare function program<model, msg, dom>(locationToMessage: (location: Location) => msg, init: (location: Location) => [model, Cmd<msg>], update: (msg: msg, model: model) => [model, Cmd<msg>], view: (model: model) => html.Html<dom, msg>, subscriptions?: (model: model) => Sub<msg>): html.Program<model, msg, dom>;
export declare function programWithFlags<flags, model, msg, dom>(locationToMessage: (location: Location) => msg, init: (flags: flags) => (location: Location) => [model, Cmd<msg>], update: (msg: msg, model: model) => [model, Cmd<msg>], view: (model: model) => html.Html<dom, msg>, subscriptions?: (model: model) => Sub<msg>): (flags: flags) => html.Program<model, msg, dom>;
