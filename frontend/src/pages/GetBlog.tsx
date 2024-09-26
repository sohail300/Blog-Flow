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

  const components = {
    code({
      inline,
      className,
      children,
      ...props
    }: {
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
    }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="overflow-x-auto">
          <pre className="bg-gray-100 w-fit p-4 rounded-lg">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mt-20 sm:mt-28">
      <div className="relative z-10 max-w-4xl mx-auto -mb-12 sm:-mb-24">
        <div className="flex flex-col md:flex-row">
          <img
            src={
              blog.photourl ||
              "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
            }
            alt={blog.title}
            className="w-full md:w-2/5 h-48 sm:h-80 object-cover rounded-lg shadow-lg shadow-gray-700/60"
          />
          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col justify-between space-y-12 md:space-y-4 md:w-3/5">
            <div className="flex flex-col justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                {blog.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis rerum veniam nihil facilis corporis nobis labore
                dolor corrupti veritatis repellat placeat expedita nam
                voluptatem exercitationem, facere ipsa aliquid dolorem
                blanditiis.
              </p>
            </div>
            <div className="flex items-center justify-between px-4 md:px-0">
              <div className="flex items-center">
                <img
                  src={
                    blog.author.photourl ||
                    "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
                  }
                  alt={blog.author.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-4 object-cover"
                />
                <div>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {blog.author.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
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
                  className="text-black cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
                  onClick={() => copyToClipboard()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <article className="relative z-0 bg-[#FDFBF7] shadow-lg rounded-lg pt-12 sm:pt-16 mt-0">
        <div className="px-4 sm:px-12 py-6 sm:py-8 prose prose-sm sm:prose-lg max-w-none">
          <ReactMarkdown className="markdown" components={components}>
            {blog.content}
          </ReactMarkdown>
        </div>
      </article>

      <div className="rounded-lg mt-6 sm:mt-10">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4">
          Suggested Reads
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
