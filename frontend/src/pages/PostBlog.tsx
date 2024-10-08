import { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/config";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Loader from "@/components/Loader";
import { ApiErrorResponse } from "@/utils/interfaces";
import "./Editor.css";

const PostBlog = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  useEffect(() => {
    isLoggedIn();
  }, []);

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

        if (content.length < 20 || content.length > 20000) {
          toast({
            title: "Content should be between 20 and 20000 characters!",
          });
          return;
        }

        const formData = new FormData();
        if (newPhoto) {
          formData.append("photo", newPhoto as File);
        }
        formData.append("title", title);
        formData.append("content", content);
        const response = await api.post("/api/blog/post", formData, {
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
          navigate(`/blog/view/${response.data.id}`);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        toast({
          variant: "destructive",
          title: (axiosError.response?.data as ApiErrorResponse).error?.message,
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
    <div className="mt-28 mx-auto p-4 md:p-6 w-full">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-2">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter blog title"
            className={`w-full md:flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              titleError ? "border-red-500" : "border-gray-300"
            }`}
            maxLength={100}
          />
          <div className="flex space-x-2 justify-center items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer text-center"
            >
              Choose Photo
            </label>
            <button
              onClick={handlePublish}
              disabled={isPublishDisabled}
              className={`w-full md:w-auto px-6 py-2 rounded-md text-white font-semibold transition duration-300 ease-in-out ${
                isPublishDisabled
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
        {titleError && (
          <p className="text-red-500 text-sm mt-1">{titleError}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {title.length}/100 characters
        </p>
      </div>
      {photoPreview && (
        <div className="mb-4">
          <img
            src={photoPreview}
            alt="Blog cover preview"
            className="w-32 h-32 object-cover rounded-lg shadow-md"
          />
        </div>
      )}
      <div className="editor-wrapper">
        <Editor
          previewStyle="vertical"
          height="400px"
          initialEditType="markdown"
          initialValue="### Start writing your blog here."
          ref={editorRef}
        />
      </div>
    </div>
  );
};

export default PostBlog;
