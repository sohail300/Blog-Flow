import { formatDate } from "@/utils/date";
import { Blog } from "@/utils/interfaces";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/utils/config";
import { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { Switch } from "@/components/ui/switch";

interface Details {
  blogs: Blog[] | undefined;
  getDetails: () => void;
}

const UserBlogs = ({ blogs, getDetails }: Details) => {
  const { toast } = useToast();

  async function handleDeleteBlog(id: number) {
    try {
      const response = await api.delete(`/api/blog/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
      if (response) {
        toast({
          title: "Blog deleted!",
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
        getDetails();
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        variant: "destructive",
        title: "Error deleting blog!",
        description: "Please try again.",
      });
    }
  }

  async function handlePublish(id: number, checked: boolean) {
    try {
      console.log(id);
      const response = await api.put(
        `/api/blog/publish/${id}`,
        { publish: checked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      if (response) {
        toast({
          title: "Changing visibility!",
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
        getDetails();
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        variant: "destructive",
        title: "Error changing visibility!",
        description: "Please try again.",
      });
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">My Blogs</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Serial
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Created On
              </th>
              <th scope="col" className="px-6 py-3">
                Published
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs?.map((blog, index) => (
              <tr key={blog.id} className="bg-white border-b">
                <td className="px-6 py-4">{blog.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {blog.title}
                </td>
                <td className="px-6 py-4">
                  {formatDate(new Date(blog.createdOn))}
                </td>
                {/* <td className="px-6 py-4">
                  <span
                    
                  >
                    {blog.published ? "Yes" : "No"}
                  </span>
                </td> */}
                <td className="px-6 py-4">
                  {/* onSubmit={form.handleSubmit(onSubmit)} */}
                  <Switch
                    className={` ${
                      blog.published ? "bg-green-500 " : "bg-yellow-500"
                    }`}
                    checked={blog.published}
                    id={`publish-${blog.id}`}
                    onCheckedChange={(checked) => {
                      handlePublish(blog.id, checked);
                    }}
                  />
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger className="text-red-600 hover:text-red-900">
                      Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-700 text-white"
                          onClick={() => {
                            handleDeleteBlog(blog.id);
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserBlogs;
