import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { otpSchema, otpType } from "@/utils/zodSchema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { api } from "@/utils/config";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Verify = () => {
  const [isSubmiting, setSubmiting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<otpType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: otpType) {
    try {
      setSubmiting(true);

      const response = await api.post("/api/auth/verifyUser", values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response) {
        toast({
          title: "Account verified!",
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Error verifying account!",
          description: "Please try again by going into your profile section.",
        });
      }
    } catch (error) {
      console.log(error as AxiosError);
      toast({
        variant: "destructive",
        title: "Error verifying account!",
        description: "Please try again by going into your profile section.",
      });
    } finally {
      setSubmiting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Verify Your Account
        </h2>
        <p className="text-center text-gray-600">
          Please enter the 6-digit code sent to your registered email.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-gray-700 text-lg font-medium text-center block">
                    Enter OTP
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      {...field}
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      className="flex justify-center"
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-12 h-12 text-2xl border-2 border-gray-300 focus:border-blue-500 rounded-md"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-red-500 mt-2 text-center" />
                </FormItem>
              )}
            />

            {isSubmiting === true ? (
              <Button
                type="submit"
                disabled
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 text-lg"
              >
                Verifying...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 text-lg"
              >
                Verify
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Verify;
