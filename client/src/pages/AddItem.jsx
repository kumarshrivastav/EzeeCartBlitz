import {
  Button,
  Label,
  TextInput,
  FileInput,
  Select,
  Rating,
} from "flowbite-react";
import { toast } from "react-hot-toast";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { addProduct } from "../http/networkRequest";
const AddItem = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formMethods = useForm();
  const { userId } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = formMethods;
  const [images, setImages] = useState([]);
  const [imageUploadStatus, setImageUploadStatus] = useState(false);
  const [imageUploadWarning, setImageUploadWarning] = useState("");
  const { categories } = useSelector((state) => state.products);
  const newCategories = categories.filter((category) => category !== "All");
  const existingImages=watch('images')
  const handleImageChange = (e) => {
    setImageUploadStatus(false);
    setImageUploadWarning("");
    const files = Array.from(e.target.files);
    const totalLength = files.length + images.length;
    if (totalLength > 3) {
      alert("you can only upload maximum of 3 images.");
    }
    setImages([...images, ...files].slice(0, 3));
    setValue("images", [...images, ...files].slice(0, 3));
  };

  const removeImage = (index) => {
    setImageUploadStatus(false);
    setImageUploadWarning("");
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setValue("images", newImages);
  };
  const watchedImages = watch("images");
  console.log(watchedImages);

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
      if (data?.images === undefined || data?.images?.length === 0) {
        setImageUploadStatus(true);
        setImageUploadWarning("atleast one image should be added");
      }
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
      const { data: res } = await addProduct(userId, jsonFormData);
      formMethods.reset();
      setImages([]);
      setValue("images", []);
      navigate("/");
      setLoading(false);
      toast.success(res?.msg);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.msg);
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="mx-auto my-2">
        <h1 className="text-[18px] md:text-2xl text-white font-serif">
          Add Product
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
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-1 my-1">
                  {images.map((image, index) => (
                    <div
                      className="relative flex justify-evenly gap-1 "
                      key={uuid()}
                    >
                      <img
                        src={URL.createObjectURL(image)}
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
            {/* // demo */}
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
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-1 my-1">
                  {images.map((image, index) => (
                    <div
                      className="relative flex justify-evenly gap-1 "
                      key={uuid()}
                    >
                      <img
                        src={URL.createObjectURL(image)}
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
            </div>
            {/* //demo */}
            <Button
              type="submit"
              outline
              gradientDuoTone={"tealToLime"}
              disabled={
                Object.keys(errors).length > 0 || imageUploadStatus || loading
              }
              className="font-serif my-2"
            >
              {loading ? "Please wait..." : "Add Product"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddItem;
