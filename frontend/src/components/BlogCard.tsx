import { formatDate } from "@/utils/date";
import { Blog } from "@/utils/interfaces";
import Markdown from "markdown-to-jsx";
import { Link } from "react-router-dom";

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

  let truncatedContent;
  if (content) {
    truncatedContent =
      content.slice(0, 400) + (content.length > 400 ? "..." : "");
  }

  console.log(id);
  return (
    <Link to={`/blog/view/${id}`}>
      <div className="w-full md:w-3/4 mx-auto bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 p-4 md:p-5">
            <div className="flex items-center mb-3">
              {authorPhoto === null ? (
                <img
                  className="w-10 h-10 rounded-full mr-3"
                  src="https://st2.depositphotos.com/4111759/12123/v/950/depositphotos_121233262-stock-illustration-male-default-placeholder-avatar-profile.jpg"
                  alt={authorName}
                />
              ) : (
                <img
                  className="w-10 h-10 rounded-full mr-3"
                  src={authorPhoto}
                  alt={authorName}
                />
              )}
              <div className="text-sm">
                <p className="text-gray-900 font-semibold leading-none">
                  {authorName}
                </p>
                <p className="text-gray-600 text-xs mt-1">{date}</p>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
            <Markdown className="text-gray-700 mb-3 text-sm">
              {truncatedContent}
            </Markdown>
          </div>
          <div className="md:w-1/3">
            {photourl === null ? (
              <img
                className="w-full h-40 md:h-full object-cover object-center"
                src="placeholder1.jpg"
                alt={title}
              />
            ) : (
              <img
                className="w-full h-40 md:h-full object-cover object-center"
                src={photourl}
                alt={title}
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
