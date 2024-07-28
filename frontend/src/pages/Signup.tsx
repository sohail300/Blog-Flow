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
import { api } from "@/utils/config";
import { signupSchema, signupType } from "@/utils/zodSchema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/utils/interfaces";

const Signup = () => {
  const [isSubmiting, setSubmiting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<signupType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: signupType) {
    try {
      setSubmiting(true);

      const response = await api.post("/api/auth/signup", values);

      if (response) {
        localStorage.setItem("token", response.data.token);
        toast({
          title: "Signed up!",
          description: "Verify your account to post a blog.",
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
        navigate("/verify");
      } else {
        toast({
          variant: "destructive",
          title: "Error Signing up!",
          description: "Please try again.",
        });
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
      setSubmiting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
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
                disabled
              >
                Signing Up...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
              >
                Sign Up
              </Button>
            )}

            <p className="text-center text-gray-500 text-sm">
              Already Signed up?{" "}
              <Link to={"/signin"} className="text-blue-600 hover:underline">
                Signin
              </Link>
            </p>

            <p className="text-center text-gray-500 text-sm">
              Forgot your password?{" "}
              <Link
                to="/changepassword"
                className="text-blue-600 hover:underline"
              >
                Reset it here
              </Link>
            </p>

            <div>
              <p
                className="text-center text-sm text-blue-600"
                onClick={() => {}}
              >
                Go to signin page for trail
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
