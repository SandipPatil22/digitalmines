import {Router} from 'express'
import { createUser, deleteUser, getUser, loginUser, updateUser } from '../controllers/user.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router=Router()

router.route('/createUser').post(createUser)

router.route('/getUser').get(verifyJWT ,getUser)

router.route('/deleteUser/:id').patch(verifyJWT,deleteUser)

router.route('/updateUser/:id').patch(verifyJWT,updateUser)

router.route('/loginUser').post(loginUser)

export default router