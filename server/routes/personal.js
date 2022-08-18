var express = require('express');
const auth = require('../middleware/auth')
const user_controller = require('../controllers/userController')

var router = express.Router();
router.post('/addmessage',  user_controller.send_message)

module.exports = router;