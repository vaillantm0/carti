import { useNavigate } from 'react-router-dom';
import { useMyOrders } from '../hooks/useCart';
import TopBar from '../components/TopBar';
import MainHeader from '../components/MainHeader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Orders = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, isError, error } = useMyOrders();

  if (isLoading) return <div className="p-8 text-center">Loading orders...</div>;
  if (isError) return <div className="p-8 text-center text-red-600">{(error as Error)?.message || 'Failed to load orders'}</div>;
  if (!orders?.length) return <div className="p-8 text-center">You have no orders yet.</div>;

  return (
    <div className="font-poppins min-h-screen flex flex-col bg-white">
      <header>
        <TopBar />
        <MainHeader cartItemCount={0} cartTotal={0} wishlistCount={0} onCartClick={() => navigate('/cart')} />
        <Navbar />
      </header>

      <main className="flex-1">
        <div className="max-w-[800px] mx-auto px-4 py-10">
          <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border rounded p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-semibold">Order #{order.id}</h2>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-semibold uppercase ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </div>

                <div className="mt-2 text-lg font-semibold">
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Orders;
