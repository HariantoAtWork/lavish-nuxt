import IndexedDBPromise from './IndexedDBPromise'

const db = {
  app: new IndexedDBPromise('lavish', 'app', { debug: false }),
  events: new IndexedDBPromise('lavish', 'events', { debug: false })
}

export default db
window.db = db
