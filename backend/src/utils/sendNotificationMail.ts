import { Context } from "hono";
import { Resend } from "resend";
import { NotificationEmail } from "../../../frontend/src/components/NotificationEmail";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { StatusCode } from "../types/statusCode";

export async function sendNotificationMail(
  c: Context,
  id: number,
  blogTitle: string
) {
  try {
    const blogLink = `${c.env.FRONTEND_URL}/blog/view/${id}`;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const subscriptions = await prisma.subscription.findMany({
      select: {
        email: true,
      },
    });

    const emailsToNotify = subscriptions.map((sub) => sub.email);
    console.log(emailsToNotify);

    const resend = new Resend(c.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: "BlogFlow <contact@heysohail.me>",
      to: emailsToNotify,
      subject: "New Blog Posted",
      react: NotificationEmail({ blogTitle, blogLink }),
    });

    console.log("Data:", data);
    console.log("Mail Sent!");
    return c.json({ msg: "Mail Sent!" }, StatusCode.ok);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
