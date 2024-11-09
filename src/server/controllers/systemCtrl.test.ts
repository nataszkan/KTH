import { buildReq, buildRes } from '../utils/testUtils'
// Test data
//
const applicationPaths = {
  system: {
    monitor: {
      uri: '/_monitor',
    },
    robots: {
      uri: '/robots.txt',
    },
  },
}

jest.mock('@kth/log', () => ({
  init: jest.fn(() => {}),
  info: jest.fn(() => {}),
  debug: jest.fn(() => {}),
  error: jest.fn(() => {}),
}))

jest.mock('../configuration', () => ({
  serverConfig: {
    api_keys: '1234',
    apiKey: {},
    nodeApi: {},
    db: {},
    logging: {
      log: {
        level: 'debug',
      },
    },
    ldap: {},
    proxyPrefixPath: {
      uri: '/api/node',
    },
    collections: [],
  },
}))

jest.mock('@kth/mongo', () => ({
  connect: jest.fn(),
  isOk: jest.fn(() => true),
}))

describe(`System controller`, () => {
  beforeEach(() => {})
  afterEach(() => {})

  test('monitor returns successfully', async () => {
    const req = buildReq({})
    const res = buildRes()

    const { monitor } = require('./systemCtrl')

    await monitor(req, res)
    expect(res.status).toHaveBeenNthCalledWith(1, 200)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('about returns successfully', async () => {
    const req = buildReq({ headers: {} })
    const res = buildRes()

    const { about } = require('./systemCtrl')

    await about(req, res)
    expect(res.render).toHaveBeenCalledTimes(1)
  })
  test('about JSON returns successfully', async () => {
    const req = buildReq({})
    const res = buildRes()

    const { about } = require('./systemCtrl')

    await about(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
  })
  test('status  returns successfully', async () => {
    const req = buildReq({})
    const res = buildRes()

    // eslint-disable-next-line no-shadow
    const { status } = require('./systemCtrl')

    await status(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('robotsTxt returns successfully', async () => {
    const req = buildReq({})
    const res = buildRes()

    const { robotsTxt } = require('./systemCtrl')

    await robotsTxt(req, res)

    expect(res.render).toHaveBeenCalledTimes(1)
    expect(res.type).toHaveBeenNthCalledWith(1, 'text')
  })

  test('paths returns successfully', async () => {
    const req = buildReq({})
    const res = buildRes()

    const { paths } = require('./systemCtrl')

    await paths(req, res)

    expect(res.json).toHaveBeenNthCalledWith(1, applicationPaths)
  })

  test('get swagger.json returns successfully', async () => {
    const req = buildReq({})
    const res = buildRes()

    const { swagger } = require('./systemCtrl')
    await swagger(req, res)
    const swaggerData = require('../../../swagger.json')
    expect(res.json).toHaveBeenNthCalledWith(1, swaggerData)
  })

  test('get swagger ui returns successfully', async () => {
    const req = buildReq({})
    const res = buildRes()
    const path = require('path')
    const fs = require('fs')
    const swaggerUrl = `/api/node/swagger.json`
    const swaggerIndexHtml = fs
      .readFileSync(path.resolve(__dirname, '../../../node_modules/swagger-ui-dist/swagger-initializer.js'), 'utf8')
      .toString()

    const petstoreUrl = 'https://petstore.swagger.io/v2/swagger.json'
    expect(swaggerIndexHtml).toContain(petstoreUrl)

    const patchedSwaggerIndexHtml = swaggerIndexHtml.replace(petstoreUrl, swaggerUrl)
    expect(patchedSwaggerIndexHtml).not.toContain(petstoreUrl)
    expect(patchedSwaggerIndexHtml).toContain(swaggerUrl)

    const { swaggerUI } = require('./systemCtrl')

    await swaggerUI(req, res)
    expect(res.type).toHaveBeenNthCalledWith(1, 'text/javascript')
    expect(res.send).toHaveBeenNthCalledWith(1, patchedSwaggerIndexHtml)
  })
})
export {}
