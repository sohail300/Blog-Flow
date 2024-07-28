import { Hono } from "hono";
import {
  sendVerificationMail,
  signin,
  signup,
  verifyUser,
} from "../controllers/auth";
import { auth } from "../middleware/authorisation";

const authRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    MY_BUCKET: string;
  };
  Variables: {};
}>();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/verifyUser", auth, verifyUser);
authRouter.get("/sendVerificationMail", auth, sendVerificationMail);

export default authRouter;
