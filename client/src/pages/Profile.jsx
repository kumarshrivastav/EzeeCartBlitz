import react, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { Label, TextInput, Button } from "flowbite-react";
import {
  currentpwdstatus,
  passwordResetLink,
  updateprofile,
} from "../http/networkRequest";
import { useParams } from "react-router-dom";
import {
  userUpdateFailure,
  userUpdateStart,
  userUpdateSuccess,
} from "../redux/userSlice";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
const Profile = () => {
  useAuth();
  const { userId } = useParams();
  const [currentPwdStatus, setCurrentPwdStatus] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const formMethods = useForm();
  const [currentPwdVerify, setCurrentPwdVerify] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = formMethods;
  const [updateFormData, setUpdateFormData] = useState({});
  const [pwdVerified, setPwdVerified] = useState(true);
  const { user } = useSelector((state) => state.users);
  const [file, setFile] = useState(null);
  const [imageURI, setImageURI] = useState(null);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const fileRef = useRef(null);
  const handleChangeUpdateFormData = (e) => {
    setUpdateFormData({ ...updateFormData, [e.target.id]: e.target.value });
  };
  const handleCurrentPwd = async () => {
    try {
      setLoading(true);
      const { data } = await currentpwdstatus(userId, { currentPwd });
      setCurrentPwd("");
      if (data) {
        setCurrentPwdStatus(true);
        setPasswordVerified(true);
        setCurrentPwdVerify(true);
      } else {
        setCurrentPwdStatus(false);
        setCurrentPwdVerify(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error?.response?.data?.message);
    }
  };
  const sendPasswordResetLink = async () => {
    alert("we have sent password reset link to your gmail");
    setLoading(true);
    try {
      const { data } = await passwordResetLink(user?.email);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      let reader = new FileReader();
      reader.onloadend = function (e) {
        setImageURI(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // console.log(String(currentPwd).length)
  const onSubmit = async (formData) => {
    console.log(formData);
    dispatch(userUpdateStart());
    try {
      const JsonFormData = new FormData();
      if (formData?.avatar) {
        JsonFormData.append("avatar", formData.avatar[0]);
      }
      if (formData?.firstName) {
        JsonFormData.append("firstName", formData.firstName);
      }
      if (formData?.lastName) {
        JsonFormData.append("lastName", formData.lastName);
      }
      if (formData?.email) {
        JsonFormData.append("email", formData.email);
      }

      if (formData?.newPwd) {
        JsonFormData.append("newPwd", formData.newPwd);
      }
      if (formData?.confirmPwd) {
        JsonFormData.append("confirmPwd", formData.confirmPwd);
      }
      JsonFormData.append("currentPwdVerify", currentPwdVerify ? 1 : 0);
      const { data } = await updateprofile(userId.toString(), JsonFormData);
      dispatch(userUpdateSuccess(data.updatedUser));
      toast.success(data?.msg);
      setCurrentPwdStatus(false);
      setPasswordVerified(false);
      setCurrentPwdVerify(false);
      formMethods.reset();
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
      dispatch(userUpdateFailure(error));
    }
  };
  return (
    <div className="flex flex-col lg:mx-32">
      <h2 className="text-xl text-center font-serif font-semibold text-white my-1">
        {user?.isAdmin ? "Admin Profile" : "User Profile"}
      </h2>
      <div>
        <div className=" flex justify-center items-center w-28 h-28 mx-auto border-2 rounded-full border-yellow-200">
          <img
            src={imageURI ? imageURI : user.avatar}
            className="w-24 h-24 rounded-full self-center object-cover"
            alt="user-image"
            title="user profile image"
          />
        </div>
      </div>
      <div>
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex mx-auto">
              <label
                className="text-blue-700 cursor-pointer font-serif font-semibold text-sm "
                htmlFor="avatar"
                onClick={() => fileRef?.current?.click()}
              >
                Update Your Picture
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                ref={fileRef}
                {...register("avatar", {
                  onChange: (e) => handleImageChange(e),
                })}
                hidden
              />
            </div>
            <div className="flex flex-col gap-2 mx-1">
              <div className="flex flex-col gap-2">
                <div>
                  <div>
                    <Label
                      className="text-white font-serif"
                      htmlFor="firstName"
                      value="First Name:"
                    />
                  </div>
                  <TextInput
                    sizing="sm"
                    type="text"
                    id="firstName"
                    defaultValue={user?.firstName}
                    {...register("firstName", {
                      required: "firstName is required",
                      onChange: (e) => handleChangeUpdateFormData(e),
                    })}
                  />
                  {errors.firstName && (
                    <span className="text-red-600">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
                <div>
                  <div>
                    <Label
                      className="text-white font-serif"
                      htmlFor="lastName"
                      value="Last Name:"
                    />
                  </div>
                  <TextInput
                    sizing="sm"
                    type="text"
                    id="lastName"
                    defaultValue={user?.lastName}
                    {...register("lastName", {
                      required: "lastName is required",
                      onChange: (e) => handleChangeUpdateFormData(e),
                    })}
                  />
                  {errors.lastName && (
                    <span className="text-red-600">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div>
                  <Label
                    className="text-white font-serif"
                    htmlFor="email"
                    value="Email:"
                  />
                </div>
                <TextInput
                  sizing="sm"
                  type="email"
                  id="email"
                  defaultValue={user?.email}
                  {...register("email", {
                    required: "email is required",
                    onChange: (e) => handleChangeUpdateFormData(e),
                  })}
                />
                {errors.email && (
                  <span className="text-red-600 font-serif">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <hr className="mt-2" />
              <div className="flex flex-col gap-2">
                <h1 className="text-white font-serif font-semibold mx-auto">
                  Change Your Password
                </h1>
                <div className="flex flex-col">
                  <div>
                    <Label
                      className="text-white font-serif"
                      htmlFor="currentPwd"
                      value="Current Password:"
                    />
                  </div>
                  <TextInput
                    type="password"
                    disabled={passwordVerified}
                    sizing="sm"
                    id="currentPwd"
                    value={currentPwd}
                    // {...register("currentPwd", {
                    //   // required: "This field is required",
                    //   onChange: (e) => setCurrentPwd(e.target.value),
                    //   minLength: {
                    //     value: 8,
                    //     message: "password must be >=8 character.",
                    //   },
                    // })}
                    placeholder="your current password"
                    onChange={(e) => setCurrentPwd(e.target.value)}
                  />
                  <div className="flex flex-col justify-between">
                    <span className="text-sm font-serif text-red-500 mt-1">
                      verify your current password if want to change it.
                    </span>
                    <span
                      className={`font-serif font-semibold text-sm ${
                        currentPwdStatus ? "text-green-500" : "text-red-600"
                      }`}
                    >
                      {currentPwdStatus
                        ? "Corrent Password"
                        : "Incorrect Password"}
                    </span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <div className="flex flex-row justify-between">
                      <Button
                        color={"warning"}
                        disabled={String(currentPwd).length < 8}
                        onClick={handleCurrentPwd}
                        className={` hover:bg-white hover:text-black border text-sm font-serif mr-1`}
                      >
                        {loading
                          ? "Please wait a moment"
                          : "Verify Your Password"}
                      </Button>
                      <Button
                        gradientDuoTone={"purpleToPink"}
                        outline
                        className="font-serif"
                        onClick={sendPasswordResetLink}
                        disabled={loading}
                      >
                        Change By Gmail
                      </Button>
                    </div>
                    <div
                      className={`${
                        currentPwdStatus ? "text-green-600" : "text-red-600"
                      } mt-2 text-center border-2 p-1 ${
                        currentPwdStatus ? "bg-pink-400" : "bg-cyan-400"
                      } font-serif font-semibold`}
                    >
                      {currentPwdStatus
                        ? "Verified Success"
                        : "Verified Failure"}
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <Label
                      className="text-white font-serif"
                      htmlFor="newPwd"
                      value="New Password"
                    />
                  </div>
                  <TextInput
                    type="password"
                    sizing="sm"
                    id="newPwd"
                    disabled={!currentPwdStatus}
                    {...(currentPwdStatus && {
                      ...register("newPwd", {
                        required: "New Password is Required",
                        onChange: (e) => handleChangeUpdateFormData(e),
                        minLength: {
                          value: 8,
                          message: "password must be >=8 characters",
                        },
                      }),
                    })}
                    placeholder="enter your new password"
                  />
                  {errors.newPwd && (
                    <span className="font-serif text-red-600">
                      {errors.newPwd.message}
                    </span>
                  )}
                </div>
                <div>
                  <div>
                    <Label
                      className="text-white font-serif"
                      htmlFor="confirmPwd"
                      value="Confirm Password"
                    />
                  </div>
                  <TextInput
                    type="password"
                    sizing="sm"
                    id="confirmPwd"
                    disabled={!currentPwdStatus}
                    {...(currentPwdStatus && {
                      ...register("confirmPwd", {
                        // required: "This field is required",
                        onChange: (e) => handleChangeUpdateFormData(e),
                        validate: (val) => {
                          if (!val) {
                            return "This field is required";
                          } else if (watch("newPwd") !== val) {
                            return "Password dont't matching";
                          }
                        },
                      }),
                    })}
                    placeholder="re-enter your new password"
                  />
                  {errors.confirmPwd && (
                    <span className="font-serif text-red-600">
                      {errors.confirmPwd.message}
                    </span>
                  )}
                </div>
              </div>
              <Button
                className="font-serif my-2"
                type="submit"
                gradientDuoTone={"tealToLime"}
                outline
                disabled={Object.keys(errors).length > 0}
              >
                Update Your Profile
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Profile;
