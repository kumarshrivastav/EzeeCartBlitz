import {
  Avatar,
  Dropdown,
  Navbar,
  TextInput,
  Select,
  Badge,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { setSearchTerm, setSelectedCategory } from "../../redux/productSlice";
import { logoutuser } from "../../http/networkRequest";
import {
  userLoginFailure,
  userLogoutStart,
  userLogoutSuccess,
} from "../../redux/userSlice";
const Header = ({ title }) => {
  const navigate = useNavigate();
  const { categories, productsFromSearch } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.users);
  const [searchProduct, setSearchProduct] = useState("");
  // console.log(categories)
  // console.log(searchProduct)
  // console.log(user)
  const dispatch = useDispatch();
  const handleSearchChange = (e) => {
    setSearchProduct(e.target.value);
    dispatch(setSearchTerm(e.target.value));
  };
  const handleSelectChange = (e) => {
    // console.log(e.target.value)
    dispatch(setSelectedCategory(e.target.value));
  };
  const handleLogout = async () => {
    try {
      dispatch(userLogoutStart());
      const { data } = await logoutuser();
      localStorage.clear();
      toast.success(data);
      dispatch(userLogoutSuccess());
      return navigate("/login");
    } catch (error) {
      console.log(error);
      dispatch(userLoginFailure(error));
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <Navbar fluid>
      <div>
        <Link to={"/"}>
          <span
            className={`hidden sm:inline text-[18px] md:text-xl font-serif font-semibold text-gray-400`}
          >
            {title}
          </span>
        </Link>
        <Link to={"/"}>
          <span
            className={`inline sm:hidden text-[18px] md:text-xl font-serif font-semibold text-gray-400`}
          >
            {"ECB"}
          </span>
        </Link>
      </div>
      <div className="flex flex-row gap-2 h-auto w-auto md:gap-4">
        <div className="relative flex flex-row items-center w-20 md:w-40 transition-width duration-300 ease-in-out focus-within:w-32 md:focus-within:w-52  bg-gray-100 border border-gray-300 rounded-lg">
          <IoIosSearch className="mx-1 group-focus-within:hidden" size={30} />
          <input
            type="search"
            onChange={handleSearchChange}
            placeholder="Search..."
            value={searchProduct}
            className="w-full border-none rounded-lg focus:border-none bg-transparent focus:outline-none"
          />
        </div>
        <Select
          required
          className="w-20 md:w-44"
          onMouseEnter={handleSelectChange}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>
      <div className="mx-1 gap-1 flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt={user?.firstName + " image"}
              img={user?.avatar}
              rounded
            />
          }
        >
          <Dropdown.Header>
            <div className="flex flex-row justify-between">
              <span className="block text-sm font-serif">
                {user?.firstName} {user?.lastName}
              </span>
              {user?.isAdmin ? (
                <Badge className="font-serif">Admin</Badge>
              ) : (
                <Badge className="font-serif">User</Badge>
              )}
            </div>
            <span className="block truncate text-sm font-medium font-serif">
              {user?.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Item
            onClick={() => navigate(`/profile/${user?._id}`)}
            className="font-serif"
          >
            Profile
          </Dropdown.Item>
          <Dropdown.Item className="font-serif">Settings</Dropdown.Item>
          <Dropdown.Item className="font-serif">Earnings</Dropdown.Item>
          {user?.isAdmin && (
            <Dropdown.Item
              onClick={() => navigate(`/additem/${user?._id}`)}
              className="font-serif"
            >
              Add Item
            </Dropdown.Item>
          )}
          <Dropdown.Item
            onClick={() => navigate("/cart")}
            className="font-serif"
          >
            Your Carts
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout} className="font-serif">
            Log Out
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link className="font-serif" href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link className="font-serif" href="#">
          About
        </Navbar.Link>
        <Navbar.Link className="font-serif" href="#">
          Services
        </Navbar.Link>
        <Navbar.Link className="font-serif" href="#">
          Pricing
        </Navbar.Link>
        <Navbar.Link className="font-serif" href="#">
          Contact
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default Header;
