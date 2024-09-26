import UserBlogs from "../components/UserBlogs";
import UserDetails from "../components/UserDetails";
import { useEffect, useState } from "react";
import { api } from "@/utils/config";
import { AxiosError } from "axios";
import { User } from "@/utils/interfaces";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<User>();
  const { toast } = useToast();
  const navigate = useNavigate();

  async function getDetails() {
    try {
      const response = await api.get("/api/user/details", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response) {
        setDetails(response.data.user);
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        title: "Please signin first!",
      });
      navigate("/signin");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getDetails();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Profile</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <UserDetails
              id={details?.id}
              getDetails={getDetails}
              name={details?.name}
              email={details?.email}
              photourl={details?.photourl}
              isVerified={details?.isVerified}
              emailNotificationsEnabled={details?.emailNotificationsEnabled}
              blogs={details?.blogs}
            />
          </div>
          <div className="w-full md:w-2/3">
            <UserBlogs blogs={details?.blogs} getDetails={getDetails} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
