import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/config";
import { passwordSchema, passwordType } from "@/utils/zodSchema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

const ChangePassword = () => {
  const [isSubmiting, setSubmiting] = useState(false);
  const { toast } = useToast();
  const { token } = useParams();
  const navigate = useNavigate();

  const form = useForm<passwordType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      token: token,
    },
  });

  async function onSubmit(values: passwordType) {
    try {
      setSubmiting(true);

      const response = await api.post(
        "/api/user/forgotPassword/change",
        values
      );

      if (response) {
        localStorage.setItem("token", response.data.token);
        toast({
          title: "Password changed!",
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
        navigate("/signin");
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        variant: "destructive",
        title: "Error changing password!",
        description: "Please try again.",
      });
    } finally {
      setSubmiting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEECDF]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Set New Password
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter new password"
                      type="password"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {isSubmiting === true ? (
              <Button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
              >
                Setting New Password...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
              >
                Set New Password
              </Button>
            )}
          </form>
        </Form>

        <p className="text-center text-gray-500 text-sm">
          Remembered your old password?{" "}
          <Link to={"/signin"} className="text-blue-600 hover:underline">
            Signin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
