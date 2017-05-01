import * as _ from './liteutils'
import Syncer from './sync'

class KNEXSchemer {
  constructor (knex) {
    this.knex = knex
  }

  sync (schema, options) {
    options = _.isHash(options) ? options : {}
    return new Syncer(this.knex, schema, options)
  }
}

export default function (knex) {
  return new KNEXSchemer(knex)
}