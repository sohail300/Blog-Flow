import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { api } from "@/utils/config";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/components/ui/use-toast";
import { Share2 } from "lucide-react";

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
    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-28">
      <div className="relative z-10 rounded-lg overflow-hidden max-w-4xl mx-auto -mb-24">
        <div className="flex flex-col md:flex-row">
          <img
            src={
              blog.photourl ||
              "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
            }
            alt={blog.title}
            className="w-full md:w-2/5 h-64 object-cover"
          />
          <div className="p-6 flex flex-col justify-between space-y-4 md:w-3/5">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perspiciatis rerum veniam nihil facilis corporis nobis labore
              dolor corrupti veritatis repellat placeat expedita nam voluptatem
              exercitationem, facere ipsa aliquid dolorem blanditiis.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={
                    blog.author.photourl ||
                    "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
                  }
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="text-base font-semibold text-gray-900">
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
              <Share2 className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      <article className="relative z-0 bg-[#FDFBF7] shadow-lg rounded-lg pt-48 mt-4">
        <div className="px-6 py-8 prose prose-lg max-w-none">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default GetBlog;
