const { Async } = require('crocks')

module.exports = function ({events, hooks}) {
  events.subscribe(action => {
    if (hooks && hooks.call) {
      Async.fromPromise(hooks.call)(action)
        .fork(
          err => console.log('ERROR', err.message),
          results => null
        )

    } else {
      console.log(`${action.type}: ${JSON.stringify(action.payload)}`)
    }
  })
  return ({
    status: () => ({ok: true, msg: 'listening for events '})
  })
}