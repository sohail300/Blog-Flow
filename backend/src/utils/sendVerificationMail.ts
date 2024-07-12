import { Context } from "hono";
import { Resend } from "resend";
import { VerificationEmail } from "../../../frontend/src/components/VerificationEmail";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { StatusCode } from "../types/statusCode";
import { generateOTP } from "./generateOTP";

export async function sendMail(c: Context, name: string, email: string) {
  try {
    // Usage
    const otp = generateOTP();

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        verificationOTP: otp,
        expiryVerificationOTP: new Date(Date.now() + 1 * 60 * 60 * 1000),
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
      subject: "Verify Your Acocunt",
      react: VerificationEmail({ otp, name }),
    });

    console.log("Data:", data);
    return c.json({ msg: "Mail Sent!" }, StatusCode.ok);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
