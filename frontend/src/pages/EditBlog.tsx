import { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/config";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import Loader from "@/components/Loader";
import { ApiErrorResponse } from "@/utils/interfaces";

const EditBlog = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  async function isLoggedIn() {
    try {
      setIsLoading(true);
      await api.get("/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.log(error as AxiosError);
      navigate("/signin");
    } finally {
      setIsLoading(false);
    }
  }

  async function getBlog() {
    try {
      const response = await api.get(`/api/blog/${id}`);

      if (response) {
        setTitle(response.data.blog.title);
        setContent(response.data.blog.content);
        setPhoto(response.data.blog.photourl);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      toast({
        variant: "destructive",
        title: (axiosError.response?.data as ApiErrorResponse).error?.message,
        description: "Please try again.",
      });
    }
  }

  useEffect(() => {
    isLoggedIn();
    getBlog();
  }, []);

  useEffect(() => {
    isLoggedIn();
  }, [content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (newTitle.length > 100) {
      setTitleError("Title must be 100 characters or less");
    } else if (newTitle.trim() === "") {
      setTitleError("Title cannot be empty");
    } else {
      setTitleError("");
    }
  };

  const handlePublish = async () => {
    if (title.trim() === "") {
      toast({
        title: "Title can't be empty!",
      });
      return;
    }

    if (title.length > 100) {
      toast({
        title: "Title can't be more than 100 characters!",
      });
      return;
    }

    if (editorRef.current) {
      try {
        setIsPublishing(true);
        //@ts-expect-error getInstance is valid.
        const editorInstance = editorRef.current.getInstance();
        const content = editorInstance.getMarkdown();

        const formData = new FormData();
        formData.append("photo", newPhoto as File);
        formData.append("title", title);
        formData.append("content", content);
        const response = await api.put(`/api/blog/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response) {
          toast({
            title: "Blog published!",
            style: {
              backgroundColor: "#dff0e0",
              borderColor: "#7f9f7f",
              color: "#388e3c",
            },
          });
          navigate(`/blog/view/${id}`);
        }
      } catch (error) {
        console.log(error as AxiosError);
        toast({
          variant: "destructive",
          title: "Error publishing blog!",
          description: "Please try again.",
        });
      } finally {
        setIsPublishing(false);
      }
    }
  };

  const isPublishDisabled =
    isPublishing || title.trim() === "" || title.length > 100;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-28 mx-auto p-6">
      <div className="mb-6">
        <div className="mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:flex-grow">
              <label
                htmlFor="blog-title"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter blog title"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  titleError ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={100}
              />
              {titleError && (
                <p className="mt-1 text-xs text-red-500">{titleError}</p>
              )}
            </div>

            <div className="flex items-center space-x-4 sm:flex-shrink-0">
              <img
                src={
                  photo ||
                  "https://res.cloudinary.com/dwuzfbivo/image/upload/v1720976345/blogflow/placeholder1_vdiazo.jpg"
                }
                alt="Blog cover"
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md"
              />

              <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewPhoto(e.target.files ? e.target.files[0] : null)
                  }
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg cursor-pointer transition"
                >
                  Choose Photo
                </label>
                <button
                  onClick={handlePublish}
                  disabled={isPublishDisabled}
                  className={`py-2 px-3 rounded-lg text-white text-sm font-medium transition ${
                    isPublishDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                  }`}
                >
                  {isPublishing ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {titleError && (
          <p className="text-red-500 text-sm mt-1">{titleError}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {title.length}/100 characters
        </p>
      </div>
      <Editor
        previewStyle="vertical"
        height="500px"
        initialEditType="markdown"
        initialValue={content}
        ref={editorRef}
      />
    </div>
  );
};

export default EditBlog;
