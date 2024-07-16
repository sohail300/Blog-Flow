import { formatDate } from "@/utils/date";
import { Blog } from "@/utils/interfaces";
import { useNavigate } from "react-router-dom";

const BlogCard = ({
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
    <div className="w-full md:w-3/4 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div
        className="flex flex-col md:flex-row cursor-pointer"
        onClick={() => navigate(`/blog/view/${id}`)}
      >
        <div className="md:w-2/3 p-4 md:p-5">
          <div className="flex items-center mb-3">
            <img
              className="w-10 h-10 rounded-full mr-3 object-cover"
              src={
                authorPhoto ||
                "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976389/blogflow/person_placeholder_dl8svn.jpg"
              }
              alt={authorName}
            />
            <div className="text-sm">
              <p className="text-gray-900 font-semibold leading-none">
                {authorName}
              </p>
              <p className="text-gray-600 text-xs mt-1">{date}</p>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        </div>
        <div className="md:w-1/3">
          <img
            className="w-full h-40 md:h-full object-cover object-center"
            src={
              photourl ||
              "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
            }
            alt={title}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
