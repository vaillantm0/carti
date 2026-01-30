import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import SignIn from './pages/SignIn';
// import Products from './components/Products';
import ShopApi from './pages/ShopApi';
import ShopTypeApi from './pages/ShopTypeApi';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './context/CartContext';
import Profile from './pages/Profile';
import CartSidebar from './components/CartSidebar';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './role/AdminDashboard';
import VendorDashboard from './role/VendorDashboard';
import CustomerDashboard from './role/CustomerDashboard';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/category/:type" element={<Category />} />
        <Route path="/sign-in" element={<SignIn />} />

        <Route path="/shop/:type" element={<ShopTypeApi />} />
        <Route path="/shop" element={<ShopApi />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        

      

      
        </Routes>
        {/* Global cart */}
        <CartSidebar />
      </Router>
    </CartProvider>
  );
}

export default App;
