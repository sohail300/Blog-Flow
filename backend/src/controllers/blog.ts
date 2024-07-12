import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { StatusCode } from "../types/statusCode";
import { blogSchema, publishSchema } from "../zodSchema/blog";

export async function getAllBlogs(c: Context) {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogs = await prisma.blog.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdOn: true,
        photourl: true,
        author: {
          select: {
            name: true,
            photourl: true,
          },
        },
      },
    });

    console.log("All Blogs:", blogs);

    return c.json({ blogs }, StatusCode.ok);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
export async function getSingleBlog(c: Context) {
  try {
    const id = Number(c.req.param("id"));
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blog = await prisma.blog.findFirst({
      where: {
        id,
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdOn: true,
        photourl: true,
        author: {
          select: {
            name: true,
            photourl: true,
          },
        },
      },
    });

    console.log("Blog:", blog);
    return c.json({ blog }, StatusCode.ok);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function updateBlog(c: Context) {
  try {
    const userId = Number(c.get("id"));
    const id = Number(c.req.param("id"));

    const parsedInput = blogSchema.safeParse(await c.req.json());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error.issues[0] },
        StatusCode.invalidInput
      );
    }

    const { title, content, photourl } = parsedInput.data;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.blog.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        title,
        content,
        photourl,
      },
      select: {
        id: true,
      },
    });

    console.log("All Blogs:", blogs);
    return c.json({ blogs }, StatusCode.dataWritten);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function updatePublished(c: Context) {
  try {
    const userId = Number(c.get("id"));
    const id = Number(c.req.param("id"));

    const parsedInput = publishSchema.safeParse(await c.req.json());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error.issues[0] },
        StatusCode.invalidInput
      );
    }

    const { publish } = parsedInput.data;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.blog.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        published: publish,
      },
      select: {
        id: true,
      },
    });

    console.log("All Blogs:", blogs);
    return c.json({ blogs }, StatusCode.dataWritten);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function postBlog(c: Context) {
  try {
    const userId = Number(c.get("id"));
    const parsedInput = blogSchema.safeParse(await c.req.json());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error.issues[0] },
        StatusCode.invalidInput
      );
    }

    const { title, content, photourl } = parsedInput.data;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogs = await prisma.blog.create({
      data: {
        title,
        content,
        photourl,
        authorId: userId,
      },
      select: {
        id: true,
      },
    });

    console.log("All Blogs:", blogs);
    return c.json({ blogs }, StatusCode.dataWritten);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function deleteBlog(c: Context) {
  try {
    const userId = Number(c.get("id"));
    const id = Number(c.req.param("id"));

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.blog.delete({
      where: {
        id,
        authorId: userId,
      },
      select: {
        id: true,
      },
    });

    console.log("odos:", blog);
    return c.json({ blog }, StatusCode.dataWritten);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
