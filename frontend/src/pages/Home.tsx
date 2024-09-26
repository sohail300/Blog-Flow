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
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Home = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBlogs = async () => {
    try {
      setIsLoading(true);
      setSearchTerm("");
      const response = await api.get(`/api/blog/all?page=${page}`);
      if (response) {
        setBlogs(response.data.blogs);
        setFilteredBlogs(response.data.blogs);
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
  };

  const getTotalPages = async () => {
    try {
      const response = await api.get(`/api/blog/length`);
      if (response) {
        setTotalPages(response.data.TotalPages);
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        variant: "destructive",
        title: "Error fetching total pages!",
        description: "Please try again.",
      });
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, [page]);

  useEffect(() => {
    getTotalPages();
  }, []);

  useEffect(() => {
    setFilteredBlogs(
      blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem
            key={i}
            onClick={() => setPage(i)}
            className={`cursor-pointer ${page === i ? "bg-gray-300" : ""}`}
          >
            <PaginationLink>{i}</PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem
          key={1}
          onClick={() => setPage(1)}
          className={`cursor-pointer ${page === 1 ? "bg-gray-300" : ""}`}
        >
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem
            key={i}
            onClick={() => setPage(i)}
            className={`cursor-pointer ${page === i ? "bg-gray-300" : ""}`}
          >
            <PaginationLink>{i}</PaginationLink>
          </PaginationItem>
        );
      }

      if (page < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem
          key={totalPages}
          onClick={() => setPage(totalPages)}
          className={`cursor-pointer ${
            page === totalPages ? "bg-gray-300" : ""
          }`}
        >
          <PaginationLink>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto pt-24 px-4">
      <div className="px-8 my-4 flex items-center justify-end">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-3 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredBlogs.map((blog: Blog) => (
        <div className="mx-auto py-4 px-4" key={blog.id}>
          <BlogCard
            id={blog.id}
            title={blog.title}
            description={blog.description}
            createdOn={blog.createdOn}
            photourl={blog.photourl}
            authorName={blog.author?.name}
            authorPhoto={blog.author?.photourl}
          />
        </div>
      ))}

      <Pagination className="border border-black w-fit fixed bottom-8 right-8 bg-gray-100 rounded-md">
        <PaginationContent>
          <PaginationItem
            onClick={() => page > 1 && setPage((curr) => curr - 1)}
            className={`cursor-pointer ${
              page === 1 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <PaginationPrevious />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem
            onClick={() => page < totalPages && setPage((curr) => curr + 1)}
            className={`cursor-pointer ${
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Home;
