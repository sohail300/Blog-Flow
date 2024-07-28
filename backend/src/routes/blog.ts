import { Hono } from "hono";
import {
  deleteBlog,
  getAllBlogs,
  getPageLength,
  getSingleBlog,
  postBlog,
  updateBlog,
  updatePublished,
} from "../controllers/blog";
import { auth } from "../middleware/authorisation";

const blog = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    MY_BUCKET: string;
  };
  Variables: {};
}>();

blog.get("/all", getAllBlogs);
blog.get("/length", getPageLength);
blog.get("/:id", getSingleBlog);
blog.put("/:id", auth, updateBlog);
blog.put("/publish/:id", auth, updatePublished);
blog.post("/post", auth, postBlog);
blog.delete("/delete/:id", auth, deleteBlog);

export default blog;
