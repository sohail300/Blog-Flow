import React from "react";
import { formatDate } from "@/utils/date";
import { Blog } from "@/utils/interfaces";
import Markdown from "markdown-to-jsx";
import { useNavigate } from "react-router-dom";

const BlogCard = ({
  id,
  title,
  content,
  createdOn,
  photourl,
  authorName,
  authorPhoto,
}: Blog) => {
  const date = formatDate(new Date(createdOn));
  const navigate = useNavigate();

  let truncatedContent = "";
  if (content) {
    truncatedContent =
      typeof content === "string"
        ? content.slice(0, 100) + (content.length > 100 ? "..." : "")
        : "";
  }

  return (
    <div className="w-full md:w-3/4 mx-auto bg-[#FDFBF7] shadow-lg rounded-lg overflow-hidden h-48">
      <div
        className="flex h-full cursor-pointer"
        onClick={() => navigate(`/blog/view/${id}`)}
      >
        <div className="w-2/3 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-2">
              <img
                className="w-12 h-12 rounded-full mr-2 object-cover"
                src={
                  authorPhoto ||
                  "https://st2.depositphotos.com/4111759/12123/v/950/depositphotos_121233262-stock-illustration-male-default-placeholder-avatar-profile.jpg"
                }
                alt={authorName}
              />
              <div className="">
                <p className="text-gray-900 text-base font-semibold leading-none">
                  {authorName}
                </p>
                <p className="text-gray-600 text-sm">{date}</p>
              </div>
            </div>
            <h2 className="text-lg font-bold text-[#687368] mb-2 line-clamp-2">
              {title}
            </h2>
            <Markdown className="text-gray-700 text-sm line-clamp-3">
              {truncatedContent}
            </Markdown>
          </div>
        </div>
        <div className="w-1/3 h-full">
          <img
            className="w-full h-full object-cover object-center"
            src={photourl || "/placeholder1.jpg"}
            alt={title}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
