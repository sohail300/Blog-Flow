import { Next } from "hono";
import { Context } from "hono";
import { StatusCode } from "../types/statusCode";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export async function auth(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization");
    // console.log("token:", authHeader);

    const token = authHeader?.split(" ")[1];

    if (token) {
      const payload = await verify(token, c.env.JWT_SECRET);
      // console.log("payload:", payload);

      if (payload) {
        c.set("id", payload.id);
        await next();
      } else {
        console.log("Unauthorized");
        return c.json({ msg: "Unauthorized" }, StatusCode.unauthorized);
      }
    } else {
      console.log("Unauthorized");
      return c.json({ msg: "Unauthorized" }, StatusCode.unauthorized);
    }
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
