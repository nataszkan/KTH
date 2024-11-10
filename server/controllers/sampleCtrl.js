const log = require('@kth/log')
/**
 * Sample API controller. Can safely be removed.
 */
const { Sample } = require('../models')

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function getPerson(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter getPerson')
    let doc = {}
    doc = await Sample.findById(req.params.id)

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' })
    }
    log.debug({ req, res }, 'Leave getPerson')
    return res.json({ id: doc._id, firstName: doc.firstName, lastName: doc.lastName })
  } catch (err) {
    log.error({ err }, 'Error in getPerson')
    return next(err)
  }
}

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function postPerson(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter postPerson')
    let doc = await Sample.findById(req.params.id)

    if (!doc) {
      doc = new Sample({
        _id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      })
      log.info({ doc }, 'New document created')
    } else {
      doc.firstName = req.body.firstName
      doc.lastName = req.body.lastName
      log.info({ doc }, 'Document updated')
    }

    await doc.save()
    log.debug({ req, res }, 'Document saved successfully')
    return res.json({ id: doc._id, firstName: doc.firstName, lastName: doc.lastName })
  } catch (err) {
    log.error({ err }, 'Error in postPerson')
    return next(err)
  }
}

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */

async function putPerson(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter putPerson ')
    const doc = await Sample.findById(req.params.id)

    if (!doc) {
      log.info({ id: req.params.id }, 'Document not found')
      return res.status(404).json({ message: 'Document not found' })
    }

    doc.firstName = req.body.firstName || doc.firstName
    doc.lastName = req.body.lastName || doc.lastName
    await doc.save()

    log.info({ doc }, 'Document saved successfully')
    return res.json({ id: doc._id, firstName: doc.firstName, lastName: doc.lastName })
  } catch (err) {
    log.error({ err }, 'Error in putPerson ')
    return next(err)
  }
}

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function deletePerson(req, res, next) {
  try {
    log.debug({ req }, 'Enter deletePerson')
    const doc = await Sample.findByIdAndDelete(req.params.id)

    if (!doc) {
      log.info({ id: req.params.id }, 'Document not found')
      return res.status(404).json({ message: 'Document not found' })
    }

    log.info({ id: req.params.id }, 'Document deleted')
    return res.status(204).json({ message: 'Document deleted' })
  } catch (err) {
    log.error({ err }, 'Error in deletePerson')
    return next(err)
  }
}

module.exports = {
  getPerson,
  postPerson,
  putPerson,
  deletePerson,
}
