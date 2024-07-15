import { Context } from "hono";
import { otpSchema, signinSchema, signupSchema } from "../zodSchema/auth";
import { StatusCode } from "../types/statusCode";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcryptjs from "bcryptjs";
import { sign } from "hono/jwt";
import { sendMail } from "../utils/sendVerificationMail";

export async function signin(c: Context) {
  try {
    const parsedInput = signinSchema.safeParse(await c.req.json());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error.issues[0] },
        StatusCode.invalidInput
      );
    }

    const { email, password } = parsedInput.data;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      console.log("User doesnt exist");
      return c.json({ msg: "User doesnt exists" }, StatusCode.unauthorized);
    } else {
      const match = await bcryptjs.compare(password, user.password);

      if (match) {
        const token = await sign(
          {
            id: user.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
          },
          c.env.JWT_SECRET
        );
        return c.json({ msg: "User logged in", token }, StatusCode.ok);
      } else {
        console.log("Invalid credentails");
        return c.json({ msg: "Invalid credentails" }, StatusCode.unauthorized);
      }
    }
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function signup(c: Context) {
  try {
    const parsedInput = signupSchema.safeParse(await c.req.json());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error.issues[0] },
        StatusCode.invalidInput
      );
    }

    const { name, email, password } = parsedInput.data;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      console.log("User already exists");
      return c.json(
        { msg: "User already exists" },
        StatusCode.userAlreadyExists
      );
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          isVerified: false,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      const token = await sign(
        {
          id: newUser.id,
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        c.env.JWT_SECRET
      );

      await sendMail(c, newUser.name, newUser.email);
      console.log("User signed in");
      return c.json({ msg: "User signed up", token }, StatusCode.dataWritten);
    }
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function verifyUser(c: Context) {
  try {
    const id = c.get("id");
    console.log(id);

    const parsedInput = otpSchema.safeParse(await c.req.json());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error.issues[0] },
        StatusCode.invalidInput
      );
    }

    const { otp } = parsedInput.data;
    console.log(otp);

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findFirst({
      where: {
        id,
        verificationOTP: Number(otp),
      },
      select: {
        id: true,
      },
    });

    console.log(user);

    if (user) {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          isVerified: true,
          verificationOTP: null,
          expiryVerificationOTP: null,
        },
        select: {
          id: true,
        },
      });

      console.log("User Verified!");
      return c.json({ msg: "User Verified!" }, StatusCode.dataWritten);
    } else {
      console.log("Invalid OTP");
      return c.json({ msg: "Invalid OTP" }, StatusCode.invalidInput);
    }
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function sendVerificationMail(c: Context) {
  try {
    const id = c.get("id");

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (user) {
      await sendMail(c, user.name, user.email);
      console.log("Mail sent!");
      return c.json({ msg: "Mail sent!" }, StatusCode.ok);
    } else {
      console.log("User not found");
      return c.json({ msg: "User not found" }, StatusCode.userNotFound);
    }
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
