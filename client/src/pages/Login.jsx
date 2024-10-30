import React, { useState } from "react";
import { Label, TextInput, Button, Spinner, Modal } from "flowbite-react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import {useForm} from "react-hook-form"
import { userLogin } from "../http/networkRequest";
import toast from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux"
import {userLoginFailure,userLoginStart,userLoginSuccess} from "../redux/userSlice"
import Popup from "../components/Popup/Popup";
const Login = () => {
  const dispatch=useDispatch()
  const location=useLocation()
  const {register,handleSubmit,formState:{errors}}=useForm()
  const [loading,setLoading]=useState(false)
  const [openModel,setOpenModel]=useState(false)
  const navigate=useNavigate()
  const onSubmit=async(data)=>{
  const from=location.state?.from || "/"
    try {
      dispatch(userLoginStart())
      setLoading(true)
      const {data:res}=await userLogin(data)
      dispatch(userLoginSuccess(res))
      toast.success("User LoggedIn Successfully")
      setLoading(false)
      navigate(from,{replace:true})
    } catch (error) {
      toast.error(error?.response?.data?.message)
      dispatch(userLoginFailure(error))
      setLoading(false)
      console.log(error.response.data.message)
    }
  }
  
  return (
    <div className="flex items-center lg:mx-96">
      <div className="flex-1 mr-3">
        <form className="flex flex-col gap-4 mx-2 py-2" onSubmit={handleSubmit(onSubmit)}>
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
              className="font-serif"
              {...register("email",{required:"This field is required"})}
              id="email"
              placeholder="email123@gmail.com"
              
            />
            {
              errors.email && (
                <span className="text-red-600">{errors.email.message}</span>
              )
            }
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
              placeholder="********"
            
              {...register("password",{required:"This field is required",minLength:{
                value:8,message:"password must be atleast 8 characters"
              }})}
            />
            {
              errors.password && (
                <span className="text-red-600">{errors.password.message}</span>
              )
            }
          </div>
          <Popup openModel={openModel} setOpenModel={setOpenModel}/>
              <span onClick={(e)=>{
                e.stopPropagation()
                setOpenModel(!openModel)
              }} className="text-sm text-blue-600 cursor-pointer font-serif">Forgot Password</span>
          {
            loading ? (<Button className="font-serif my-3 rounded-none">
              <Spinner aria-label="Spinner label" size={'sm'}/>
              <span className="ml-2">Please wait...</span>
            </Button>):(<Button
              gradientDuoTone={"tealToLime"}
              outline
              className="w-full my-5 font-serif rounded-none"
              type="submit"
              disabled={Object.keys(errors).length>0}
            >
              Login here
            </Button>) 
          }
        </form>
        <p className="text-white font-serif ml-2 my-2">
          If Not Registered ?{" "}
          <Link to={"/register"} className="text-blue-600">
            Register here !
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Login;
