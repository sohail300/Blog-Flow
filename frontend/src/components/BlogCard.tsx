import ReactMarkdown from "react-markdown";
import { formatDate } from "@/utils/date";
import { Blog } from "@/utils/interfaces";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const BlogCard = ({
  id,
  title,
  description,
  createdOn,
  photourl,
  authorName,
  authorPhoto,
}: Blog) => {
  const navigate = useNavigate();
  const date = formatDate(new Date(createdOn));

  return (
    <div className="w-full md:w-3/4 mx-auto bg-[#FDFBF7] shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row md:h-56">
        <div className="w-full md:w-1/3 h-48 md:h-full">
          <img
            className="w-full h-full object-cover object-center"
            src={
              photourl ||
              "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
            }
            alt={title}
          />
        </div>
        <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
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
            <h2 className="text-lg font-bold text-[#687368] mb-2 line-clamp-1">
              {title}
            </h2>
            <div className="line-clamp-2">{description}</div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="flex items-center justify-center rounded-lg bg-black/90 text-white p-2"
              onClick={() => navigate(`/blog/view/${id}`)}
            >
              <span className="text-sm">Read More</span>
              <ExternalLink className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
