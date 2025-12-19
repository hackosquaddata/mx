import { Router } from "express";
import {
  signupUser,
  loginUser,
  getCurrentUser,
  getCourse,
  checkCourseAccess,
  getEnrolledCourses,
  forgotPassword,
  getCourseById,
  enrollFreeCourse
} from "../controllers/User.controller.js";
import { authenticate } from '../middleware/auth.js';
const router = Router();

// Avoid logging request bodies to prevent leaking credentials or PII

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/me").get(getCurrentUser);
router.route("/courses").get(getCourse);
router.get("/enrolled-courses", (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  next();
}, getEnrolledCourses);
router.get('/courses/:courseId/access', checkCourseAccess);
router.get('/courses/:courseId', getCourseById);
router.post("/forgot-password", forgotPassword);

// Auto-enroll endpoint for free courses (price == 0)
router.post('/enroll-free', authenticate, enrollFreeCourse);


export default router;