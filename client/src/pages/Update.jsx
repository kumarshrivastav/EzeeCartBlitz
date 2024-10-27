import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logoutuser, singleProduct, updateProduct } from "../http/networkRequest";
import { useForm, FormProvider } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { toast } from "react-hot-toast";
import { addProduct } from "../http/networkRequest";
import { useSelector,useDispatch } from "react-redux";
import {
  Button,
  Label,
  TextInput,
  FileInput,
  Select,
  Rating,
} from "flowbite-react";
import { userLogoutStart, userLogoutSuccess } from "../redux/userSlice";
import { updateProductToStore } from "../redux/productSlice";
import useAuth from "../hooks/useAuth";
const Update = () => {
  useAuth()
  const [singleProductFromServer, setSingleProductFromServer] = useState({});
  const { productId,userId } = useParams();
  const formMethods = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = formMethods;
  const [images, setImages] = useState([]);
  const [imageUploadStatus, setImageUploadStatus] = useState(false);
  const [imageUploadWarning, setImageUploadWarning] = useState("");
  const [uploadedImagesFiles, setUploadedImagesFiles] = useState([]);
  const { categories } = useSelector((state) => state.products);
  const watchedImages = watch("images");
  const newCategories = categories.filter((category) => category !== "All");
  const handleImageChange = (e) => {
    setImageUploadWarning("");
    const files = Array.from(e.target.files);
    const totalLength = files.length + watchedImages?.length;
    if(totalLength>3){
      alert("you can only upload maximum of 3 images")
    }
      setValue('imageFiles',[...files,...uploadedImagesFiles].slice(0,3-(watchedImages?.length)))
      setUploadedImagesFiles([...files,...uploadedImagesFiles].slice(0,3-(watchedImages?.length)))
  };
  console.log(watchedImages);
  console.log(uploadedImagesFiles)
  const removeImage = (index) => {
    setImageUploadStatus(false);
    setImageUploadWarning("");
    // const newImages = [...images];
    watchedImages.splice(index, 1);
    setImages(watchedImages);
    setValue("images", watchedImages);
  };
  // console.log(watchedImages);
  const handleDelete = (event, imageUrl) => {
    event.preventDefault();
    try {
      if(watchedImages?.length===1 && uploadedImagesFiles?.length===0){
        setImageUploadWarning('atleast one image should be added')
        return
      }
      setValue(
        "images",
        watchedImages?.filter((image) => image !== imageUrl)
      );      
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await singleProduct(productId);
        setSingleProductFromServer(data)
        formMethods.reset();
        setImageUploadWarning("")
        reset(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [productId, singleProductFromServer.name, reset]);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (data?.images?.length > 3) {
        setImageUploadStatus(false);
        setValue("images", [...data.images].slice(0, 3));
      }
      if (data?.images?.length < 4 && data.images.length > 0) {
        setImageUploadStatus(false);
        setValue("images", [...data.images]);
      }
      // if (data?.images === undefined || data?.images?.length === 0) {
      //   setImageUploadStatus(true);
      //   setImageUploadWarning("atleast one image should be added");
      // }
      const jsonFormData = new FormData();
      data.name && jsonFormData.append("name", data.name);
      data.description && jsonFormData.append("description", data.description);
      data.price && jsonFormData.append("price", data.price);
      data.category && jsonFormData.append("category", data.category);
      data.rating && jsonFormData.append("rating", data.rating);
      data?.images !== undefined &&
        data?.images?.length !== 0 &&
        Array.from(data.images).forEach((image, index) =>
          jsonFormData.append(`images`, image)
        );
      data?.imageFiles !== undefined && Array.from(data?.imageFiles)?.length !== 0 && (
        Array.from(data?.imageFiles).forEach((imageFile)=>jsonFormData.append('imageFiles',imageFile))
      )
      const { data: {savedUpdatedProduct,msg} } = await updateProduct(userId,productId,jsonFormData);
      dispatch(updateProductToStore({productId,product:savedUpdatedProduct}))
      formMethods.reset();
      setImages([]);
      setValue("images", []);
      navigate("/");
      setLoading(false);
      toast.success(msg);
    } catch (error) {
      setLoading(false);
      if(String(error?.response?.data?.message).toLowerCase() === String("jwt must be provided").toLowerCase()){
        toast.error("Session expired login again...")
        dispatch(userLogoutStart());
        const { data } = await logoutuser();
        window.localStorage.clear();
        toast.success(data);
        dispatch(userLogoutSuccess());
        return navigate("/login");
      }
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-2 lg:mx-32">
      <div className="mx-auto my-2">
        <h1 className="text-[18px] md:text-2xl text-white font-serif">
          Update Product
        </h1>
      </div>
      <hr />
      <div className="mx-1">
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div>
              <div>
                <Label
                  className="font-serif text-white text-xl text-[16px]"
                  htmlFor="productName"
                  value="Product Name : "
                />
              </div>
              <TextInput
                sizing={"sm"}
                id="productName"
                type="text"
                placeholder="enter product name"
                {...register("name", { required: "Product Name is Required" })}
              />
              {errors.productName && (
                <p className="text-red-500 font-serif">
                  {errors.productName.message}
                </p>
              )}
            </div>
            <div>
              {/* category */}
              <div>
                <Label
                  htmlFor="category"
                  value="Select Product Category :"
                  className="text-white text-[16px] font-serif"
                />
              </div>
              <Select
                id="category"
                {...register("category", {
                  required: "This field is required",
                })}
              >
                {newCategories &&
                  newCategories.map((category) => (
                    <option value={category} key={uuid()}>
                      {category}
                    </option>
                  ))}
              </Select>
              {errors.category && (
                <span className="font-serif text-red-600">
                  {errors.category.message}
                </span>
              )}
            </div>
            <div>
              {/* discription */}
              <div>
                <Label
                  htmlFor="description"
                  value="Product Description :"
                  className="text-white text-[16px] font-serif"
                />
              </div>
              <TextInput
                type="text"
                id="description"
                placeholder="enter product description"
                {...register("description", {
                  required: "This field is required",
                })}
              />
              {errors.description && (
                <span className="font-serif text-red-600">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div>
              <div>
                <Label
                  htmlFor="price"
                  value="Product Price :"
                  className="text-white font-serif text-[16px]"
                />
              </div>
              <TextInput
                type="number"
                placeholder="enter product price"
                min={100}
                max={9999}
                {...register("price", { required: "This field is required" })}
              />
              {errors.price && (
                <span className="text-red-600 font-serif">
                  {errors.price.message}
                </span>
              )}
            </div>
            <div className="border-2 p-1 border-dashed">
              <div>
                {/* product rating */}
                <Label
                  htmlFor="rating"
                  value="Product Rating :"
                  className="text-white text-[16px] font-serif"
                />
              </div>
              <input
                type="range"
                id="rating"
                min="0"
                max="5"
                step="0.5"
                {...register("rating", { required: "Rating is required" })}
                className="w-full"
              />
              <div className="flex items-center gap-2 mt-2">
                <Rating>
                  {[...Array(5)].map((_, index) => (
                    <Rating.Star
                      key={index}
                      filled={index < Math.ceil(watch("rating") || 0)}
                    />
                  ))}
                </Rating>
                <span className="text-white font-serif">
                  {watch("rating") || 0} out of 5
                </span>
              </div>
              {errors.rating && (
                <span className="font-serif text-red-600">
                  {errors.rating.message}
                </span>
              )}
            </div>
            {/* <div>
              <div>
                <Label
                  htmlFor="images"
                  alt="product-images"
                  value="Product Images :"
                  className="text-[16px] font-serif text-white"
                />
              </div>
              <FileInput
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={images.length > 3}
              />
              <div className="flex flex-col">
                <span className="text-sm font-serif text-yellow-300">
                  Number of images should not be exceed more than 3
                </span>
                {imageUploadWarning && (
                  <span className="text-red-600 font-serif text-sm">
                    {imageUploadWarning}
                  </span>
                )}
              </div>
              {watchedImages?.length > 0 && (
                <div className="grid grid-cols-3 gap-1 my-1">
                  {watchedImages?.map((image, index) => (
                    <div
                      className="relative flex justify-evenly gap-1 "
                      key={uuid()}
                    >
                      <img
                        src={image}
                        alt={`image preview ${index}`}
                        className="h-32 w-24 object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 items-center text-center text-white bg-opacity-50 hover:bg-gray-500 hover:bg-opacity-50 font-serif"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
            <div>
              <div>
                <Label
                  htmlFor="images"
                  alt="product-images"
                  value="Product Images :"
                  className="text-[16px] font-serif text-white"
                />
              </div>
              <FileInput
                type="file"
                accept="image/*"
                multiple
                // {...register("imageFiles", {
                //   validate: (imageFiles) => {
                //     const totalLength =
                //       (watchedImages?.length || 0) + imageFiles?.length;
                //     if (totalLength === 0) {
                //       return "Atleast one image should be added";
                //     }
                //     if (totalLength > 3) {
                //       return "No of Images should not more than 3";
                //     }
                //     if(totalLength<3 && totalLength>0){
                //       setUploadedImagesFiles(imageFiles)
                //     }
                //   },
                //   onChange:(e)=>setUploadedImagesFiles(e.target.files)
                // })}
                onChange={handleImageChange}
                disabled={watchedImages?.length>=3}
              />
              {/* <div className="flex flex-col">
                <span className="text-sm font-serif text-yellow-300">
                  Number of images should not be exceed more than 3
                </span>
                {imageUploadWarning && (
                  <span className="text-red-600 font-serif text-sm">
                    {imageUploadWarning}
                  </span>
                )}
              </div> */}
              {imageUploadWarning && (
                <span className="text-red-600 font-serif text-sm">
                  {imageUploadWarning}
                </span>
              )}
              {(watchedImages?.length > 0 ||
                uploadedImagesFiles.length > 0) && (
                <div className="grid grid-cols-3 gap-1 my-1">
                  {watchedImages?.map((image, index) => (
                    <div
                      className="relative flex justify-evenly gap-1 "
                      key={uuid()}
                    >
                      <img
                        src={image}
                        alt={`image preview ${index}`}
                        className="h-32 w-24 object-cover"
                      />
                      <button
                        onClick={(e) => handleDelete(e, image)}
                        className="absolute inset-0 items-center text-center text-white bg-opacity-50 hover:bg-gray-500 hover:bg-opacity-50 font-serif"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {Array.from(uploadedImagesFiles)?.length>0 && Array.from(uploadedImagesFiles).map((file, index) => (
                    watchedImages?.length+(index+1)<4 && ((
                      <div
                        className="relative flex justify-evenly gap-1"
                        key={uuid()}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`new image preview ${index}`}
                          className="h-32 w-24 object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            console.log('watchedImage Length:',watchedImages?.length)
                            console.log('uploadedImageFiles Length;',uploadedImagesFiles?.length)
                            if(watchedImages?.length===0 && uploadedImagesFiles?.length===1){
                              setImageUploadWarning('atleast one image should be added')
                              return
                            }
                            const newFiles = Array.from(uploadedImagesFiles).filter(
                              (_, i) => i !== index
                            );
                            setUploadedImagesFiles(newFiles);
                            setValue('imageFiles',newFiles)
                            
                          
                          }}
                          className="absolute inset-0 items-center text-center text-white bg-opacity-50 hover:bg-gray-500 hover:bg-opacity-50 font-serif"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                    
                  ))}
                </div>
              )}
            </div>
            <span className="text-sm font-serif text-yellow-300">No of Images should not more than 3</span>
            <Button
              type="submit"
              outline
              gradientDuoTone={"tealToLime"}
              disabled={Object.keys(errors).length > 0}
              className="font-serif my-2"
            >
              {loading ? "Please wait..." : "Update Product"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Update;
