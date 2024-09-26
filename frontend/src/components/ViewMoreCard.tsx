import { formatDate } from "@/utils/date";
import { Blog } from "@/utils/interfaces";
import { useNavigate } from "react-router-dom";

const SuggestedBlogCard = ({
  id,
  title,
  createdOn,
  photourl,
  authorName,
  authorPhoto,
}: Blog) => {
  const date = formatDate(new Date(createdOn));
  const navigate = useNavigate();

  return (
    <div
      className="w-64 h-64 bg-[#FDFBF7] shadow-lg rounded-lg overflow-hidden cursor-pointer"
      onClick={() => navigate(`/blog/view/${id}`)}
    >
      <div className="h-32">
        <img
          className="w-full h-full object-cover object-center"
          src={
            photourl ||
            "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
          }
          alt={title}
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold text-[#687368] mb-2 line-clamp-2">
          {title}
        </h2>
        <div className="flex items-center mt-3">
          <img
            className="w-8 h-8 rounded-full mr-2 object-cover"
            src={
              authorPhoto ||
              "https://st2.depositphotos.com/4111759/12123/v/950/depositphotos_121233262-stock-illustration-male-default-placeholder-avatar-profile.jpg"
            }
            alt={authorName}
          />
          <div className=" ml-1">
            <p className="text-gray-900 text-sm font-semibold leading-none">
              {authorName}
            </p>
            <p className="text-gray-600 text-xs">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedBlogCard;
