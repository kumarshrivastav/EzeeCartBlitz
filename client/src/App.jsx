import {BrowserRouter,Routes,Route} from "react-router-dom"
import {Home,Single,Login,Register,Cart,Profile, AddItem, Update} from "./pages"
import PrivateRoute from "./components/PrivateRoute/PrivateRoute"

function App() {

  return (
    <>
    {/* <Header title="Ezee-Cart-Blitz"/> */}
    {/* <Navbars /> */}
    <hr/>
    <Routes>
    <Route path='/login' element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path='/cart' element={<Cart/>}/>
    <Route path="/single/:id" element={<Single/>}/>
    <Route element={<PrivateRoute/>}>
      <Route path="/profile/:userId" element={<Profile/>}/>
      <Route path="/additem/:userId" element={<AddItem/>}/>
      <Route path="/updateitem/:userId/:productId" element={<Update/>}/>
    </Route>
    </Routes>
    </>
  )
}

export default App
