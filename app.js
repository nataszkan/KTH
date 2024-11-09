'use strict'

require('dotenv').config()

const fs = require('fs')
const log = require('@kth/log')
const config = require('./server/configuration').server
const server = require('./server/server')

const packageFile = require('./package.json')

// catches uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  if (err.toString().match(/(ECONNRESET|MongoNetworkError)/i)) {
    log.warn(`DB connection reset origin (${origin})`, { err })
  } else {
    log.error('APPLICATION EXIT - uncaught exception in ', packageFile.name)
    log.error(`Uncaught Exception, origin (${origin})`, { err })
    process.exit(1)
  }
})
// catches unhandled promise rejections
process.on('unhandledRejection', reason => {
  // This line below provokes an uncaughtException and will be caught few lines
  // above
  log.error(`unhandledRejection  ${packageFile.name}`, reason)
  // throw reason
})

function checkEnvironment() {
  try {
    log.info(`Checking environment variables from .env.ini file.`)
    const lines = fs
      .readFileSync('./.env.ini')
      .toString()
      .split('\n')
      .filter(l => l.trim() && !l.startsWith('#'))
      .filter(l => l)

    const isDevelopment = process.env.NODE_ENV !== 'production'
    lines.forEach(l => {
      const name = l.substring(0, l.indexOf('=')).trim()
      if (name && process.env[name] !== undefined) {
        log.debug(`   Environment variable '${name}' found`)
      } else if (isDevelopment) {
        log.debug(`   Environment variable '${name}' is missing, most likely there is a default value.`)
      } else {
        log.warn(`   Environment variable '${name}' is missing.`)
      }
    })
    log.info(`Checking environment variables completed.`)
  } catch (err) {
    log.error({ err }, `Failed to check environment variables`)
  }
}
checkEnvironment()

/* ****************************
 * ******* SERVER START *******
 * ****************************
 */
const { port } = config
server.listen(port, () => {
  log.info(`Http server listening on port ${port}`)
})
