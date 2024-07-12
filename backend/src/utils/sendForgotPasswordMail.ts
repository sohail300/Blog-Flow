import { Context } from "hono";
import { Resend } from "resend";
import { ForgotPasswordEmail } from "../../../frontend/src/components/ForgotPasswordEmail";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { StatusCode } from "../types/statusCode";
import { v4 as uuidv4 } from "uuid";

export async function sendForgotPasswordMail(
  c: Context,
  name: string,
  email: string
) {
  try {
    const token = uuidv4();
    const link = `${c.env.FRONTEND_URL}/changePassword/${token}`;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        forgotPasswordToken: token,
        expiryforgotPasswordToken: new Date(
          Math.floor(Date.now() / 1000) + 1 * 60 * 60
        ),
      },
      select: {
        id: true,
      },
    });

    console.log(c.env.RESEND_API_KEY);
    const resend = new Resend(c.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: "BlogFlow <contact@heysohail.me>",
      to: email,
      subject: "Reset Your Password",
      react: ForgotPasswordEmail({ name, link }),
    });

    console.log("Data:", data);
    return c.json({ msg: "Mail Sent!" }, StatusCode.ok);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
