import { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/config";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import Loader from "@/components/Loader";

const EditBlog = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  async function isLoggedIn() {
    try {
      setIsLoading(true);
      const response = await api.get("/me", {
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
        console.log(response.data);
        setTitle(response.data.blog.title);
        setContent(response.data.blog.content);
      }
    } catch (error) {
      console.log(error as AxiosError);
    }
  }

  useEffect(() => {
    isLoggedIn();
    getBlog();
  }, []);

  const handleTitleChange = (e) => {
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
        const editorInstance = editorRef.current.getInstance();
        const content = editorInstance.getMarkdown();

        const response = await api.put(
          `/api/blog/${id}`,
          { title, content },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response) {
          toast({
            title: "Blog published!",
            style: {
              backgroundColor: "#dff0e0",
              borderColor: "#7f9f7f",
              color: "#388e3c",
            },
          });
          navigate("/");
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
        <div className="flex items-center space-x-4 mb-2">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter blog title"
            className={`flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              titleError ? "border-red-500" : "border-gray-300"
            }`}
            maxLength={100}
          />
          <button
            onClick={handlePublish}
            disabled={isPublishDisabled}
            className={`px-6 py-2 rounded-md text-white font-semibold transition duration-300 ease-in-out ${
              isPublishDisabled
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }`}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
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
