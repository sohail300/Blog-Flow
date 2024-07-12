import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { StatusCode } from "../types/statusCode";
import {
  emailSchema,
  passwordSchema,
  userUpdateSchema,
  userUpdateType,
} from "../zodSchema/user";
import bcryptjs, { hash } from "bcryptjs";
import { sendForgotPasswordMail } from "../utils/sendForgotPasswordMail";
import user from "../routes/user";

export async function getUserBlogs(c: Context) {
  try {
    const id = c.get("id");

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.blog.findMany({
      where: {
        authorId: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdOn: true,
        photourl: true,
      },
    });

    console.log("All Blogs:", blogs);

    return c.json({ blogs }, StatusCode.ok);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
export async function deletUser(c: Context) {
  try {
    const id = c.get("id");

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.delete({
      where: {
        id,
      },
    });

    console.log("User deleted:", user);
    return c.json({ msg: "User deleted" }, StatusCode.dataWritten);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
export async function getUserDetails(c: Context) {
  try {
    const id = c.get("id");
    console.log("user", id);

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        photourl: true,
        isVerified: true,
        blogs: {
          select: {
            id: true,
            title: true,
            content: true,
            published: true,
            createdOn: true,
            photourl: true,
          },
          orderBy: {
            createdOn: "desc",
          },
        },
      },
    });

    console.log("User:", user);

    return c.json({ user }, StatusCode.ok);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function updateUser(c: Context) {
  try {
    const id = c.get("id");
    console.log(id);

    const parsedInput = userUpdateSchema.safeParse(await c.req.json());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error.issues[0] },
        StatusCode.invalidInput
      );
    }

    const { name } = parsedInput.data;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
      select: {
        id: true,
      },
    });

    console.log("User:", user);
    return c.json({ msg: "User updated" }, StatusCode.dataWritten);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function updatePhoto(c: Context) {
  try {
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function userIsVerified(c: Context) {
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
        isVerified: true,
      },
    });

    console.log("User:", user);
    return c.json({ user }, StatusCode.ok);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
export async function forgotPasswordSendMail(c: Context) {
  try {
    const parsedInput = emailSchema.safeParse(await c.req.json());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error.issues[0] },
        StatusCode.invalidInput
      );
    }

    const { email } = parsedInput.data;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (user) {
      await sendForgotPasswordMail(c, user.name, user.email);
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
export async function changePassword(c: Context) {
  try {
    const parsedInput = passwordSchema.safeParse(await c.req.json());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error.issues[0] },
        StatusCode.invalidInput
      );
    }

    const { password, token } = parsedInput.data;
    console.log(password);
    console.log(token);

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userFound = await prisma.user.findFirst({
      where: {
        forgotPasswordToken: token,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (userFound) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const user = await prisma.user.update({
        where: {
          email: userFound.email,
        },
        data: {
          password: hashedPassword,
          forgotPasswordToken: null,
          expiryforgotPasswordToken: null,
        },
        select: {
          id: true,
        },
      });

      console.log("Password Changed!");
      return c.json({ msg: "Password Changed!" }, StatusCode.dataWritten);
    } else {
      console.log("Password not changed");
      return c.json({ msg: "Password not changed" }, StatusCode.invalidInput);
    }
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
