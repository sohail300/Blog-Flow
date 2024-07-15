import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { StatusCode } from "../types/statusCode";
import { blogSchema, imageSchema, publishSchema } from "../zodSchema/blog";

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

    // console.log("All Blogs:", blogs);
    console.log("All Blogs");

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

    console.log("Single Blog");
    return c.json({ blog }, StatusCode.ok);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function updateBlog(c: Context) {
  try {
    const userId = Number(c.get("id"));
    const id = Number(c.req.param("id"));
    console.log(id);

    const parsedInput = blogSchema.safeParse(await c.req.parseBody());
    const parsedPhoto = imageSchema.safeParse(await c.req.parseBody());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error?.issues[0] },
        StatusCode.invalidInput
      );
    }

    console.log(parsedInput);
    console.log(parsedPhoto);

    const { title, content } = parsedInput.data;

    let photo;
    if (parsedPhoto.success !== false) {
      photo = parsedPhoto.data.photo;
    }

    let photourl;

    if (photo) {
      const fileArrayBuffer = await photo.arrayBuffer();

      // Convert ArrayBuffer to Base64
      const base64 = arrayBufferToBase64(fileArrayBuffer);

      photourl = `data:${photo.type};base64,${base64}`;
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.blog.update({
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

    console.log("Updated");
    return c.json({ id: blog.id }, StatusCode.dataWritten);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}

export async function postBlog(c: Context) {
  try {
    const userId = Number(c.get("id"));
    console.log(userId);
    const parsedInput = blogSchema.safeParse(await c.req.parseBody());
    const parsedPhoto = imageSchema.safeParse(await c.req.parseBody());

    if (parsedInput.success === false) {
      console.log("Invalid Input");
      return c.json(
        { error: parsedInput.error?.issues[0] },
        StatusCode.invalidInput
      );
    }

    console.log(parsedInput);
    console.log(parsedPhoto);
    const { title, content } = parsedInput.data;

    let photo;
    if (parsedPhoto.success !== false) {
      photo = parsedPhoto.data.photo;
    }

    let photourl;

    if (photo) {
      const fileArrayBuffer = await photo.arrayBuffer();

      // Convert ArrayBuffer to Base64
      const base64 = arrayBufferToBase64(fileArrayBuffer);

      photourl = `data:${photo.type};base64,${base64}`;
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blog = await prisma.blog.create({
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

    console.log("Updated");
    return c.json({ id: blog.id }, StatusCode.dataWritten);
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

    const blog = await prisma.blog.update({
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

    console.log("Updated");
    return c.json({ id: blog.id }, StatusCode.dataWritten);
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

    console.log("Deleted");
    return c.json({ msg: "Deleted" }, StatusCode.dataWritten);
  } catch (error) {
    console.log("Error occured:", error);
    return c.json({ error }, StatusCode.serverError);
  }
}
