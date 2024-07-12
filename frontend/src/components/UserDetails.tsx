import { api } from "@/utils/config";
import { User } from "@/utils/interfaces";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
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

interface UserDetailsProps {
  getDetails: () => void; // Adjust the function signature as needed
}

const UserDetails = ({
  name,
  email,
  photourl,
  isVerified,
  getDetails,
}: User & UserDetailsProps) => {
  const [newName, setNewName] = useState(name);
  const [isSending, setIsSending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  async function handleSendVerificationEmail() {
    try {
      setIsSending(true);
      const response = await api.get("/api/auth/sendVerificationMail", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response) {
        toast({
          title: "Mail sent!",
          description: "Use the OTP to verify your account.",
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
        navigate("/verify");
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        variant: "destructive",
        title: "Error sending mail!",
        description: "Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  }

  async function handleNameUpdate() {
    try {
      setIsUpdating(true);
      const response = await api.post(
        `/api/user/update`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      if (response) {
        toast({
          title: "Name changed!",
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
        title: "Error changing name!",
        description: "Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteUser() {
    try {
      const response = await api.delete("/api/user/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response) {
        toast({
          title: "User Deleted!",
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        variant: "destructive",
        title: "Error deleting user!",
        description: "Please try again.",
      });
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        {photourl === null ? (
          <img
            src="https://st2.depositphotos.com/4111759/12123/v/950/depositphotos_121233262-stock-illustration-male-default-placeholder-avatar-profile.jpg"
            alt="User"
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
        ) : (
          <img
            src={photourl}
            alt="User"
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <div className="flex">
          <input
            className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            type="text"
            placeholder="Name"
          />
          {isUpdating === true ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
              disabled
              onClick={() => handleNameUpdate()}
            >
              Updating...
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
              onClick={() => handleNameUpdate()}
            >
              Update
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          value={email}
          placeholder="Email"
          disabled
        />
      </div>
      <div className="flex items-center mb-4">
        <span className="text-sm mr-2">Verified:</span>

        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isVerified ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
          }`}
        >
          {isVerified ? "Yes" : "No"}
        </span>
      </div>
      {isVerified === false &&
        (isSending === true ? (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
            onClick={() => handleSendVerificationEmail()}
            disabled
          >
            Sending...
          </button>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
            onClick={() => handleSendVerificationEmail()}
          >
            Send Verification Email
          </button>
        ))}

      <AlertDialog>
        <AlertDialogTrigger className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4">
          Delete User
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteUser()}
              className="bg-red-500 hover:bg-red-700 text-white"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserDetails;
