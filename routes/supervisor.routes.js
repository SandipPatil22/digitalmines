import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {fieldsupload} from '../middlewares/multer.middleware.js'
import { createSupervisor, deleteSupervisor, getSupervisor, getUserProfile, loginSupervisor, updateSupervisor } from '../controllers/supervisor.controller.js'
const router = Router()


router
  .route("/register-supervisor")
  .post(fieldsupload,verifyJWT, createSupervisor);

router.route("/login-supervisor").post(loginSupervisor);

router.route('/getUserProfile').post(getUserProfile)// mobile route

router.route('/get-supervisor').get(verifyJWT,getSupervisor)

router.route('/delete-supervisor/:supervisorId').patch(verifyJWT,deleteSupervisor)

router.route('/update-supervisor/:id').patch(verifyJWT,updateSupervisor)
export default router