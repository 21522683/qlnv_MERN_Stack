import express from 'express'
import { StaffController } from "../controllers/index.js";

const router = express.Router();


router.get('/getAllStaff', StaffController.getAllStaff);
router.post('/addNewStaff', StaffController.addNewStaff);
router.put('/updateStaff/:id', StaffController.updateStaff);
router.delete('/deleteStaff/:id', StaffController.deleteStaff);




export default router;