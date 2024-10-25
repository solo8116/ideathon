import { Router } from "express";
import { authenticateUser} from "../middleware/auth/auth.middleware";
import { signUpStudent, loginStudent } from "../controllers/studentauth.controller";
import { signUpAlumni,loginAlumni } from "../controllers/alumniauth.controller";
const router = Router();

// Student Routes
router.post("/student/signup", authenticateUser, signUpStudent);
router.post("/student/login", authenticateUser, loginStudent);

// Alumni Routes
router.post("/alumni/signup", authenticateUser, signUpAlumni);
router.post("/alumni/login", authenticateUser, loginAlumni);

export default router;
