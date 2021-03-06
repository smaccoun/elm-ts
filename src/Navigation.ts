import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/skip'
import 'rxjs/add/operator/take'
import { Subject } from 'rxjs/Subject'
import { Task } from 'fp-ts/lib/Task'
import { none as optionNone } from 'fp-ts/lib/Option'
import { Cmd } from './Cmd'
import { Sub, none, batch } from './Sub'
import * as html from './Html'
import { Location as HistoryLocation } from 'history'
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()

const location$ = new Subject<Location>()



export type Location = HistoryLocation

function getLocation(): Location {
  return history.location
}

history.listen(location => {
  console.log('LISTENING: ', location)
  location$.next(location)
})

export function push<msg>(url: string): Cmd<msg> {
  return Observable.of(
    new Task(() => {
      history.push(url)
      return Promise.resolve(optionNone)
    })
  )
}

export function program<model, msg, dom>(
  locationToMessage: (location: Location) => msg,
  init: (location: Location) => [model, Cmd<msg>],
  update: (msg: msg, model: model) => [model, Cmd<msg>],
  view: (model: model) => html.Html<dom, msg>,
  subscriptions: (model: model) => Sub<msg> = () => none
): html.Program<model, msg, dom> {
  location$.subscribe({
    next: (l: Location) => {
      console.log('SEE NOW WE ARE SUBSCRIBED WHICH IS COOL AND HERES THE LOCATION: ', l)
      locationToMessage(l)
    }
  })
  const onChangeLocation$ = location$.map(location => locationToMessage(location))
  const subs = (model: model): Sub<msg> => batch([subscriptions(model), onChangeLocation$])
  return html.program(init(getLocation()), update, view, subs)
}

export function programWithFlags<flags, model, msg, dom>(
  locationToMessage: (location: Location) => msg,
  init: (flags: flags) => (location: Location) => [model, Cmd<msg>],
  update: (msg: msg, model: model) => [model, Cmd<msg>],
  view: (model: model) => html.Html<dom, msg>,
  subscriptions: (model: model) => Sub<msg> = () => none
): (flags: flags) => html.Program<model, msg, dom> {
  return flags => program(locationToMessage, init(flags), update, view)
}
