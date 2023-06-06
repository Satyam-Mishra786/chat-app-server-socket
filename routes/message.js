const router = require('express').Router()

const { getMessages, newMessage } = require('../controllers/Message')


router.get('/:conversationId',getMessages)
router.post('/',newMessage);

module.exports = router