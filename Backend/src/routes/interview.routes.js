const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')

const interviewRouter = express.Router();

interviewRouter.post('/', authMiddleware.authUser, upload.single('resume'), interviewController.generateInterviewReportController);  // Route to generate an interview report based on the candidate's resume, self-describe, and job describe, isme humne phele auth middleware lga diya taki agar user login nhi hai to ye route access na kar paye. aur agar user login hai to interviewController.generateInterviewReport function call hoga jo ki interview report generate karega
interviewRouter.get('/report/:interviewId', authMiddleware.authUser, interviewController.getInterviewReportByIdController);
interviewRouter.get('/', authMiddleware.authUser, interviewController.getAllInterviewReportController);
interviewRouter.post('/resume/pdf/:interviewReportId', authMiddleware.authUser, interviewController.generateResumePdfController);


module.exports = interviewRouter;