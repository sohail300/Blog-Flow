import { Context, Hono } from "hono";
import authRouter from "./routes/auth";
import blogRouter from "./routes/blog";
import userRouter from "./routes/user";
import { cors } from "hono/cors";
import { auth } from "./middleware/authorisation";
import seedDatabase from "../prisma/seed";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    MY_BUCKET: string;
  };
  Variables: {};
}>();

app.use(cors());

app.get("/", (c: Context) => {
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

app.get("/seed", async (c) => {
  try {
    await seedDatabase(c);
    return c.json({ message: "Database seeded successfully" });
  } catch (error) {
    return c.json(
      {
        error: "Seeding failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

app.notFound((c: Context) => {
  return c.text("Invalid Route", 404);
});

// app.onError((err, c) => {
//   console.error(`${err}`);
//   return c.text("Custom Error Message", 500);
// });

export default app;
