import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { passwordResetLink } from "../../http/networkRequest";
import { useSelector } from "react-redux";
const Popup = ({ openModel, setOpenModel }) => {
  const { user } = useSelector((state) => state.users);
  const formMethods = useForm();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = formMethods;
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const handleForgotPwd = async () => {
    if (!email) {
      return setEmailMsg("Please enter your email address");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return setEmailMsg("Please enter valid email address")
    }
    setEmailMsg("");
    try {
      await passwordResetLink(email);
      toast.success("We have been sent password reset link");
      setOpenModel(false)
      setEmail("")
      setEmailMsg("")
    } catch (error) {
        console.log(error)
        setEmail("")
      toast.error(error?.response?.data?.message);
      setEmailMsg(error?.response?.data?.message);
    }
  };

  return (
    <>
      {openModel && (
        <Modal
          show={openModel}
          size={"md"}
          onClose={() => {
            setEmail("")
            setEmailMsg("")
            setOpenModel(!openModel)
          }
          }
        >
          <Modal.Header />
          <Modal.Body>
            <div
              className="flex flex-col gap-4"
            >
              <div>
                <Label
                  htmlFor="rest-email"
                  className=""
                  value="Enter your registered email for your password reset"
                />
              </div>
              <div>
                <TextInput
                  type="email"
                  id="reset-email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailMsg && (
                  <span className="text-sm text-red-500 font-serif">
                    {emailMsg}
                  </span>
                )}
              </div>
              <Button onClick={handleForgotPwd}>
                Reset Password
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default Popup;
