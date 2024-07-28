import { Hono } from "hono";
import {
  changePassword,
  deletUser,
  forgotPasswordSendMail,
  getUserDetails,
  updatePhoto,
  updateUser,
  userIsVerified,
} from "../controllers/user";
import { auth } from "../middleware/authorisation";

const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    MY_BUCKET: string;
  };
  Variables: {};
}>();

user.delete("/delete", auth, deletUser);
user.get("/details", auth, getUserDetails);
user.post("/update", auth, updateUser);
user.put("/updatePhoto", auth, updatePhoto);
user.get("/isVerified", auth, userIsVerified);

// Forgot Password
user.post("/forgotPassword/sendMail", forgotPasswordSendMail);
user.post("/forgotPassword/change", changePassword);

export default user;
