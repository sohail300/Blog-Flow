import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { AxiosError } from "axios";
import { api } from "@/utils/config";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import { Blog } from "@/utils/interfaces";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { toast } = useToast();

  async function getAllBlogs() {
    try {
      const response = await api.get("/api/blog/all");

      if (response) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.log(error as AxiosError);

      toast({
        variant: "destructive",
        title: "Error fetching blogs!",
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllBlogs();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto pt-24 px-4">
      {blogs.map((blog: Blog) => {
        return (
          <div className="mx-auto py-4 px-4" key={blog.id}>
            <BlogCard
              id={blog.id}
              title={blog.title}
              content={blog.content}
              createdOn={blog.createdOn}
              photourl={blog.photourl}
              authorName={blog.author?.name}
              authorPhoto={blog.author?.photourl}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Home;
