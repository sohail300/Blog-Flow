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
import { signinSchema, signinType } from "@/utils/zodSchema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";

const Signin = () => {
  const [isSubmiting, setSubmiting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<signinType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  async function onSubmit(values: signinType) {
    try {
      setSubmiting(true);

      const response = await api.post("/api/auth/signin", values);

      if (response) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        title: "Error Signing in!",
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
          Sign In
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                Signing In...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
              >
                Sign In
              </Button>
            )}

            <p className="text-center text-gray-500 text-sm">
              Haven't signed up yet?{" "}
              <Link to={"/signup"} className="text-blue-600 hover:underline">
                Signup
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
                Credentials for trail (Click to copy)
              </p>
              <div
                className="text-center text-gray-500 text-sm flex flex-row items-center justify-center mt-2 cursor-pointer"
                onClick={() => copyToClipboard("test@test.com")}
              >
                Email: test@test.com <Copy className="ml-4" size={20} />
              </div>
              <div
                className="text-center text-gray-500 text-sm flex flex-row items-center justify-center mt-2 cursor-pointer"
                onClick={() => copyToClipboard("test123")}
              >
                Password: test123 <Copy className="ml-4" size={20} />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signin;
