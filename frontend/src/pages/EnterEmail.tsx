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
import { emailSchema, emailType } from "@/utils/zodSchema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const EnterEmail = () => {
  const [isSubmiting, setSubmiting] = useState(false);
  const { toast } = useToast();

  const form = useForm<emailType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: emailType) {
    try {
      setSubmiting(true);

      const response = await api.post(
        "/api/user/forgotPassword/sendMail",
        values
      );

      if (response) {
        localStorage.setItem("token", response.data.token);
        toast({
          title: "Mail sent!",
          description:
            "Change your password using the link sent to your email.",
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        variant: "destructive",
        title: "Error sending email!",
        description: "Please try again.",
      });
    } finally {
      setSubmiting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Reset Password
        </h2>
        <p className="text-center text-gray-600">
          Enter your email to receive a password reset link
        </p>

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
                      placeholder="Your email address"
                      type="email"
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
                Sending...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
              >
                Send Reset Link
              </Button>
            )}
          </form>
        </Form>

        <p className="text-center text-gray-500 text-sm">
          Remember your password?{" "}
          <Link to={"/signin"} className="text-blue-600 hover:underline">
            Signin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EnterEmail;
