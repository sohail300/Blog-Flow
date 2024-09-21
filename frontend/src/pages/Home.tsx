import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { AxiosError } from "axios";
import { api } from "@/utils/config";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import { Blog } from "@/utils/interfaces";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { toast } = useToast();
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  async function getAllBlogs() {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/blog/all?page=${page}`);

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

  async function getTotalPages() {
    try {
      const response = await api.get(`/api/blog/length`);

      if (response) {
        setTotalPages(response.data.TotalPages);
      }
    } catch (error) {
      console.log(error as AxiosError);

      toast({
        variant: "destructive",
        title: "Error fetching blogs!",
        description: "Please try again.",
      });
    }
  }

  useEffect(() => {
    getAllBlogs();
  }, [page]);

  useEffect(() => {
    getTotalPages();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto pt-24 px-4 ">
      <div className=" px-8 my-4 flex items-center justify-end">
        <div className="flex">
          <Input
            type="text"
            placeholder="Search..."
            className="rounded-r-none border-r-0"
          />
          <Button size="icon" className="rounded-l-none bg-[#687368]">
            <Search className="h-4 w-4  text-white" />
          </Button>
        </div>

        <Pagination className=" border border-black w-fit fixed bottom-8 right-8 bg-gray-100 rounded-md">
          <PaginationContent>
            <PaginationItem
              onClick={() => setPage((curr) => --curr)}
              className=" cursor-pointer"
            >
              <PaginationPrevious />
            </PaginationItem>
            {Array(totalPages)
              .fill(0)
              .map((_item, index) => {
                return (
                  <PaginationItem
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`cursor-pointer ${
                      index === page - 1 ? "bg-gray-300" : ""
                    }`}
                  >
                    <PaginationLink>{index + 1}</PaginationLink>
                  </PaginationItem>
                );
              })}
            <PaginationItem
              onClick={() => setPage((curr) => ++curr)}
              className=" cursor-pointer"
            >
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

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
