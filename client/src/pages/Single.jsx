import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import data from "../data";
import { Button, Modal, Rating } from "flowbite-react";
import Line from "../components/Single/Line";
import { v4 as uuid } from "uuid";
// image sliding
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
// image sliding
import { useDispatch, useSelector } from "react-redux";
import { setSingleProduct as setSingleProductToStore } from "../redux/productSlice";
import Products from "../components/Products/Products";
import AddToCart from "../components/Button/AddToCart";
import RemoveToCart from "../components/Button/RemoveToCart";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import {
  deleteProductById,
  similarProductsFromServer,
  singleProduct,
} from "../http/networkRequest";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
const Single = () => {
  // useAuth()
  const [isZoomed, setIsZoomed] = useState(false);
  const { user } = useSelector((state) => state.users);
  const [openModal, setOpenModal] = useState(false);
  const {
    products,
    singleProduct: singleProductFromStore,
    similarProducts: similarProductsFromStore,
  } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { id } = useParams();
  const [singleProduct, setSingleProduct] = useState({});
  const dispatch = useDispatch();
  const [isDeleted, setIsDeleted] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  useEffect(() => {
    dispatch(setSingleProductToStore(id));

    console.log(id);
  }, [id]);
  useEffect(() => {
    // console.log(singleProductFromStore)

    const fetchData = async () => {
      try {
        // Fetch single product
        if (singleProductFromStore) {
          setSingleProduct(singleProductFromStore);
          // setSimilarProducts(similarProductsFromStore);
        } else {
          const { data } = await singleProduct(id);
          setSingleProduct(data);
        }

        // Fetch similar products using the fetched product's category
        if (similarProducts?.length > 0) {
          setSimilarProducts(similarProductsFromStore);
        } else {
          const urlParams = new URLSearchParams();
          urlParams.append("category", singleProduct?.category);
          const similarData = await similarProductsFromServer(
            urlParams.toString()
          );
          console.log(similarData.data);
          const newSimilarProducts = similarData?.data?.filter(
            (product) => product?.name !== singleProduct?.name
          );
          setSimilarProducts(newSimilarProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    id,
    singleProduct,
    singleProductFromStore,
    similarProductsFromStore,
    similarProducts,
    dispatch,
  ]);
  const closeHandleModal = () => {
    setOpenModal(false);
  };
  const handleProductDelete = async () => {
    try {
      const { data } = await deleteProductById(id);
      setIsDeleted(true);
      toast.success(data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="grid grid-cols-1 my-8 mx-4">
      <div className="">
        <div className="mx-auto bg-white rounded-lg h-80">
          <Swiper
            pagination={{ dynamicBullets: true }}
            modules={[Pagination]}
            className="w-full h-full"
          >
            {singleProduct?.images?.map((image) => (
              <SwiperSlide
                className="flex justify-center items-center"
                key={uuid()}
              >
                {/* <div className="flex justify-items-center"> */}
                <Zoom>
                  <div className="h-60 w-full flex justify-center items-center cursor-pointer rounded-lg mb-6">
                    <img
                      src={image}
                      alt={singleProduct.name}
                      className="h-60 object-contain cursor-pointer rounded-lg mb-6 mx-auto"
                    />
                  </div>
                </Zoom>
                {/* </div> */}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <Modal show={openModal} size="md" popup onClose={closeHandleModal}>
          <Modal.Header />
          <Modal.Body>
            {isDeleted ? (
              <div className="flex flex-row">
                <h1>Product have been deleted Successfully</h1>
                <span>✔</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <h1 className="text-black font-serif">
                  Are You Sure Want To Delete This Product
                </h1>
                <div className="flex flex-row justify-evenly my-4">
                  <Button
                    className="flex border-2 flex-col font-serif text-center cursor-pointer"
                    outline
                    onClick={handleProductDelete}
                  >
                    Yes 👍{" "}
                  </Button>
                  <Button
                    className="flex border-2 flex-col font-serif text-center cursor-pointer"
                    outline
                    onClick={()=>setOpenModal(false)}
                  >
                    No 👎
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
        {user?.isAdmin && (
          <div className="flex flex-row justify-between my-2 mx-1">
            <span
              className="text-yellow-300 font-serif font-semibold cursor-pointer"
              onClick={() => navigate(`/updateitem/${user?._id}/${id}`)}
            >
              Update
            </span>
            <span
              onClick={() => setOpenModal(true)}
              className="cursor-pointer text-red-600 font-serif font-semibold"
            >
              Delete
            </span>
          </div>
        )}
        <div className="mx-auto text-white my-4">
          <h1 className="text-sm font-bold font-serif ">
            <span>Product Name : </span>
            {singleProduct?.name}
          </h1>
          <p className="text-sm pt-2 font-serif">
            Price&nbsp;:&nbsp;
            <span className="font-bold">
              &#8377;&nbsp;{singleProduct?.price}
            </span>
          </p>
          <p className="text-sm mt-2 text-justify font-serif">
            <span>Product Description : </span>
            {singleProduct?.description}
          </p>
          <div className="flex flex-row my-2">
            <span className="font-serif text-sm">Product Rating :&nbsp;</span>
            <Rating>
              {Array.from({ length: 5 }, (_, i) =>
                +singleProduct?.rating > i ? (
                  <Rating.Star key={i} filled={true} />
                ) : (
                  <Rating.Star key={i} filled={false} />
                )
              )}
            </Rating>
          </div>
          {cartItems.findIndex((p) => p._id === singleProduct?._id) === -1 ? (
            <AddToCart product={singleProduct} />
          ) : (
            <RemoveToCart product={singleProduct} />
          )}
        </div>
      </div>
      <Line />
      <h2 className="font-serif text-md my-2 md:text-2xl font-semibold text-center text-white">
        Similar Products Like This
      </h2>
      <Products data={similarProducts} />
      {/* <Button onClick={}>Fetch Similar Products</Button> */}
    </div>
    // <h1>Hello </h1>
  );
};

export default Single;
