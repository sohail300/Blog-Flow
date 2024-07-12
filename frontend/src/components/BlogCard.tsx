import { formatDate } from "@/utils/date";
import { Blog } from "@/utils/interfaces";

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

  console.log(id);
  return (
    <div className="w-full md:w-3/4 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3 p-6">
          <div className="flex items-center mb-4">
            <img
              className="w-12 h-12 rounded-full mr-4"
              src={authorPhoto}
              alt={authorName}
            />
            <div className="text-sm">
              <p className="text-gray-900 font-semibold leading-none">
                {authorName}
              </p>
              <p className="text-gray-600 text-xs mt-1">{date}</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
          <p className="text-gray-700 mb-4">formatDate({content})</p>
        </div>
        <div className="md:w-1/3">
          <img
            className="w-full h-48 md:h-full object-cover object-center"
            src={photourl}
            alt={title}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
