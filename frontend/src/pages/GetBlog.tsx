import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { api } from "@/utils/config";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/components/ui/use-toast";

const GetBlog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    createdOn: "",
    photourl: null,
    author: {
      name: "",
      photourl: null,
    },
  });
  const { id } = useParams();
  const { toast } = useToast();

  async function getBlog() {
    try {
      const response = await api.get(`/api/blog/${id}`);

      if (response) {
        setBlog(response.data.blog);
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        variant: "destructive",
        title: "Error fetching blog!",
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getBlog();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className=" mx-auto px-12 py-8 mt-28">
      <article className="bg-white shadow-lg rounded-lg px-20">
        <img
          src={`${
            blog.photourl ||
            "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
          }`}
          alt={blog.title}
          className="w-full h-64 object-contain"
        />
        <div className="px-6 py-4 flex flex-row justify-between">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center mb-6">
            <img
              src={
                blog.author.photourl ||
                "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
              }
              alt={blog.author.name}
              className="w-10 h-10 rounded-full mr-4 object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {blog.author.name}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(blog.createdOn).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-8 prose prose-lg max-w-none">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default GetBlog;
