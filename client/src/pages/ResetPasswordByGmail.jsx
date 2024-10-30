import { Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordByGmail } from "../http/networkRequest";
import toast from "react-hot-toast";
const ResetPasswordByGmail = () => {
  const formMethods = useForm();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = formMethods;
  const navigate = useNavigate();
  const handlePasswordReset = async (formData) => {
    try {
      const { data } = await resetPasswordByGmail(userId, formData);
      toast.success(data);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="flex flex-col">
      <h1 className="mx-auto my-1 text-lg font-serif text-white">
        Reset Your Password
      </h1>

      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(handlePasswordReset)}
          className="flex flex-col gap-3 m-2"
        >
          <div>
            <div className="mb-1">
              <Label
                htmlFor="password"
                value="Enter Your Password :"
                className="font-serif text-white"
              />
            </div>
            <TextInput
              id="password"
              type="password"
              className="font-serif"
              placeholder="enter your password"
              {...register("password", {
                required: "This field is Required",
                minLength: {
                  value: 8,
                  message: "Password length must be >=8 Chanracters",
                },
              })}
            />
            {errors.password && (
              <span className="font-serif text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>
          <div>
            <div className="mb-1">
              <Label
                htmlFor="confirmPassword"
                value="Confirm Your Password :"
                className="font-serif text-white"
              />
            </div>
            <TextInput
              id="confirmPassword"
              type="password"
              placeholder="confirm your password"
              className="font-serif"
              {...register("confirmPassword", {
                validate: (e) => {
                  if (!e) {
                    return "This Field is Required";
                  } else if (watch("password") !== e) {
                    return "Password is Not Matching";
                  }
                },
              })}
            />
            {errors.confirmPassword && (
              <span className="font-serif text-red-600">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          {loading ? (
            <Button className="font-serif my-3 rounded-none">
              <Spinner aria-label="Spinner label" size={"sm"} />
              <span className="ml-2">Please wait...</span>
            </Button>
          ) : (
            <Button
              gradientDuoTone={"tealToLime"}
              outline
              className="w-full my-5 font-serif rounded-none"
              type="submit"
              disabled={Object.keys(errors).length > 0}
            >
              Reset Your Password
            </Button>
          )}
          {/* <Button
            type="submit"
            className="font-serif"
            outline
            gradientDuoTone={"tealToLime"}
          >
            Reset Your Password
          </Button> */}
        </form>
      </FormProvider>
    </div>
  );
};

export default ResetPasswordByGmail;
