import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, useCancelOrder } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import TopBar from '../components/TopBar';
import MainHeader from '../components/MainHeader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error } = useOrder(id!);
  const cancelOrderMutation = useCancelOrder();
  const { showToast } = useToast();

  const handleCancel = async () => {
    if (!order) return;
    try {
      await cancelOrderMutation.mutateAsync(order.id);
      showToast('Order cancelled', 'success');
    } catch (err) {
      showToast((err as Error)?.message || 'Failed to cancel order', 'error');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading order...</div>;
  if (isError || !order) return <div className="p-8 text-center text-red-600">{(error as Error)?.message || 'Order not found'}</div>;

  return (
    <div className="font-poppins min-h-screen flex flex-col bg-white">
      <header>
        <TopBar />
        <MainHeader cartItemCount={0} cartTotal={0} wishlistCount={0} onCartClick={() => navigate('/cart')} />
        <Navbar />
      </header>

      <main className="flex-1">
        <div className="max-w-[800px] mx-auto px-4 py-10">
          <button onClick={() => navigate('/orders')} className="text-sm text-blue-600 hover:underline mb-4">
            ← Back to Orders
          </button>

          <div className="bg-white border rounded p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
                <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
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

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-start gap-4 pb-4 border-b">
                  <div className="w-16 h-16 bg-gray-200 border rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
            </div>

            {order.status === 'pending' && (
              <div className="mt-6">
                <button
                  onClick={handleCancel}
                  disabled={cancelOrderMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {cancelOrderMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default OrderDetail;
