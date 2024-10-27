import React, { useState } from "react";
import { Label, TextInput, Button, Spinner } from "flowbite-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { userRegister } from "../http/networkRequest";
import toast from "react-hot-toast";

const Register = () => {
  const nav=useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading,setLoading]=useState(false)
  const onSubmit =async (data) => {
    const {confirmPwd,...rest}=data
    try {
      setLoading(true)
      const {data}=await userRegister(rest)
      toast.success("User Registered Successfully")
      console.log(data)
      setLoading(false)
      nav("/login")
    } catch (error) {
      toast.error(error?.response?.data?.message)
      setLoading(false)
      console.log(error.response.data.message)
    }

  };
  return (
    <div className="flex lg:mx-96">
      {/* <div className="flex-1">
        <img
          src="/images/registerImage.png"
          className="h-[585px]"
          alt="register image"
        />
      </div> */}
      <div className="flex-1">
        <form
          className="flex flex-col gap-2 mx-2 py-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <div>
              <Label
                htmlFor="firstName"
                className="text-white text-lg font-serif"
                value="First Name:"
              />
            </div>
            <TextInput
            sizing={'sm'}
              type="text"
              id="firstName"
              className="font-serif"
              placeholder="firstname"
              {...register("firstName", {
                required: "This field is required",
              })}
            />
            {errors.firstName && (
              <span className="text-red-600">{errors.firstName.message}</span>
            )}
          </div>
          <div>
            <div>
              <Label
                htmlFor="lastName"
                className="text-white text-lg font-serif"
                value="Last Name:"
              />
            </div>
            <TextInput
            sizing={'sm'}
              type="text"
              id="lastName"
              placeholder="lastname"
              className="font-serif"
              {...register("lastName", {
                required: "This field is required",
              })}
            />
            {errors.lastName && (
              <span className="text-red-600">{errors.lastName.message}</span>
            )}
          </div>
          <div>
            <div>
              <Label
                htmlFor="email"
                className="text-white text-lg font-serif"
                value="Email:"
              />
            </div>
            <TextInput
              type="email"
              sizing={'sm'}
              id="email"
              className="font-serif"
              placeholder="email123@gmail.com"
              {...register("email", {
                required: "This field is required",
                minLength: {
                  value: 15,
                  message: "email must be greater than 15 characters",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-600">{errors.email.message}</span>
            )}
          </div>
          <div>
            <div>
              <Label
                htmlFor="password"
                className="text-white text-lg font-serif"
                value="Password:"
              />
            </div>
            <TextInput
              type="password"
              id="password"
              sizing={'sm'}
              placeholder="********"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 8,
                  message: "password must be greater than 8 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-600">{errors.password.message}</span>
            )}
          </div>
          <div>
            <div>
              <Label
                htmlFor="confirmPwd"
                className="text-white text-lg font-serif"
                value="Confirm Password:"
              />
            </div>
            <TextInput
            sizing={'sm'}
              type="password"
              id="confirmPwd"
              placeholder="********"
              {...register("confirmPwd", {
                required: "This field is required",
                validate: (val) => {
                  if (!val) {
                    return "This field is required";
                  } else if (watch("password") !== val) {
                    return "Password don't match";
                  }
                },
              })}
            />
            {errors.confirmPwd && (
              <span className="text-red-600">{errors.confirmPwd.message}</span>
            )}
          </div>

          {
            loading ? (<Button className="font-serif my-3 rounded-none">
              <Spinner aria-label="Spinner button" size={'sm'}/>
              <span className="font-serif ml-2">Please wait...</span>
            </Button>):(<Button
              
              gradientDuoTone={"tealToLime"}
              outline
              className="w-full my-5 font-serif rounded-none"
              type="submit"
              disabled={Object.keys(errors).length>0}
            >
              Create New Account
            </Button>)
          }
        </form>
        <p className="text-white font-serif ml-2 mb-2">
          If Already Registered ?{" "}
          <Link to={"/login"} className="text-blue-600">
            Login here !
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Register;
