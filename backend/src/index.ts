import { Context, Hono } from "hono";
import authRouter from "./routes/auth";
import blogRouter from "./routes/blog";
import userRouter from "./routes/user";
import { cors } from "hono/cors";
import { FRONTEND_URL } from "./utils/config";
import { auth } from "./middleware/authorisation";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {};
}>();

app.use(cors());

app.get("/", (c) => {
  console.log("Healthy Server!");
  return c.text("Healthy Server!");
});

app.get("/me", auth, (c: Context) => {
  const id = c.get("id");
  console.log("me", id);
  console.log("Is Logged In!");
  return c.json({ isLoggedIn: true, id });
});

app.route("/api/auth", authRouter);
app.route("/api/blog", blogRouter);
app.route("/api/user", userRouter);

app.notFound((c) => {
  return c.text("Invalid Route", 404);
});

// app.onError((err, c) => {
//   console.error(`${err}`);
//   return c.text("Custom Error Message", 500);
// });

export default app;
