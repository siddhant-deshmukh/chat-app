var express = require('express');
const auth = require('../middleware/auth')
const user_controller = require('../controllers/userController')
const chat_controller = require('../controllers/chatController')

const app = express();
var router = express.Router();
const groupRouter = require('./group')
const personalRouter=require('./personal')

/* GET users listing. */
router.post('/',auth,user_controller.get_user_data );
router.post('/register',  user_controller.register_user)
router.post('/login', user_controller.login_user)
router.post('/logout',user_controller.logout_user)
router.post('/connect',auth,user_controller.add_connection)
router.post('/disconnect',auth,user_controller.remove_connection)
//app.use('/group',groupRouter)
//app.use('/personal',personalRouter)

//router.get('/personal/get-friend-list',auth,user_controller.get_friend_list)
router.post('/personal/addmessage', auth, chat_controller.send_message)
router.post('/personal/getmessage',auth, chat_controller.get_messages)
router.post('/personal/addFriend',auth, chat_controller.add_contact)
router.post('/personal/sendmessage',auth,chat_controller.send_message)

//router.post('/', user_controller.login_user)

module.exports = router;