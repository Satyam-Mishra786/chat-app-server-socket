const router = require('express').Router()
const {getConversation, startConversation} = require('../controllers/conversation')


router.get('/:userId',getConversation)
router.post('/', startConversation)


module.exports = router