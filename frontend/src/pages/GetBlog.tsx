import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { api, FRONTEND_URL } from "@/utils/config";
import { AxiosError } from "axios";
import { useParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/components/ui/use-toast";
import { Share2 } from "lucide-react";
import SuggestedBlogCard from "@/components/ViewMoreCard";
import { Blog } from "@/utils/interfaces";

const GetBlog = () => {
  const url = useLocation();
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

  const [viewMoreBlogs, setViewMoreBlogs] = useState<Blog[]>([]);
  const { id } = useParams();
  const { toast } = useToast();

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(`${FRONTEND_URL}\\${url.pathname}`);
      toast({
        title: "Copied to clipboard!",
        description: "You can now share this blog.",
      });
    } catch (error) {
      console.log(error as Error);
      toast({
        variant: "destructive",
        title: "Error copying to clipboard!",
        description: "Please try again.",
      });
    }
  }

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

  async function showMoreBlogs() {
    try {
      const response = await api.get(`/api/blog/view-more/${id}`);
      if (response) {
        setViewMoreBlogs(response.data.firstFiveBlogs);
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
    showMoreBlogs();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-28">
      <div className="relative z-10 max-w-4xl mx-auto -mb-24">
        <div className="flex flex-col md:flex-row">
          <img
            src={
              blog.photourl ||
              "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
            }
            alt={blog.title}
            className="w-full md:w-2/5 h-80 object-cover rounded-lg shadow-lg shadow-gray-700/60"
          />
          <div className="px-6 flex flex-col justify-between space-y-4 md:w-3/5">
            <div className="flex flex-col justify-between ">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis rerum veniam nihil facilis corporis nobis labore
                dolor corrupti veritatis repellat placeat expedita nam
                voluptatem exercitationem, facere ipsa aliquid dolorem
                blanditiis.
              </p>
            </div>
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
              <div className="p-2 border border-black rounded-full flex justify-center items-center shadow-2xl shadow-gray-700/70">
                <Share2
                  className="text-black cursor-pointer w-6 h-6"
                  onClick={() => copyToClipboard()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <article className="relative z-0 bg-[#FDFBF7] shadow-lg rounded-lg pt-16 mt-4">
        <div className="px-12 py-8 prose prose-lg max-w-none">
          <ReactMarkdown className={"markdown"}>{blog.content}</ReactMarkdown>
        </div>
      </article>

      <div className="rounded-lg mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Suggested Reads
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {viewMoreBlogs.map((blog) => (
            <SuggestedBlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              content={blog.content}
              createdOn={blog.createdOn}
              photourl={blog.photourl}
              authorName={blog.author?.name}
              authorPhoto={blog.author?.photourl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetBlog;
