import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBoxOpen,
  FaShoppingBag,
  FaSignOutAlt,
} from 'react-icons/fa';

// --- Product Modal Component ---
const ProductModal = ({ isOpen, onClose, onSubmit, product, mode }) => {
  const [formData, setFormData] = useState({
    imageUrl: '',
    name: '',
    description: '',
    rating: 5,
    price: 0,
  });

  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData(product);
    } else {
      setFormData({
        imageUrl: '',
        name: '',
        description: '',
        rating: 5,
        price: 0,
      });
    }
  }, [product, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-gray-800 text-white rounded-lg shadow-xl z-50">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">
            {mode === 'add' ? 'Add Product' : 'Edit Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Rating (1–5)
            </label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
            >
              {mode === 'add' ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// --- Products Tab ---
const ProductsTab = ({ allProducts, onOpenEditModal, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="bg-gray-700">
        <tr>
          <th className="p-4">Image</th>
          <th className="p-4">Name</th>
          <th className="p-4">Price</th>
          <th className="p-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {allProducts.map((product) => (
          <tr key={product.id} className="border-b border-gray-700">
            <td className="p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            </td>
            <td className="p-4">
              <div className="font-semibold">{product.name}</div>
            </td>
            <td className="p-4 font-bold text-cyan-400">₹{product.price}</td>
            <td className="p-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => onOpenEditModal(product)}
                  className="text-yellow-400 hover:text-yellow-300 p-2"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="text-red-500 hover:text-red-400 p-2"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
// --- Orders Tab ---
const OrdersTab = ({ orders }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="bg-gray-700">
        <tr>
          <th className="p-4">Order ID</th>
          <th className="p-4">Product</th>
          <th className="p-4">Price</th>
          <th className="p-4">Customer Email</th>
          <th className="p-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.orderId} className="border-b border-gray-700">
            <td className="p-4">{order.orderId}</td>
            <td className="p-4 flex items-center space-x-3">
              <img
                src={order.imageUrl}
                alt={order.productName}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <span>{order.productName}</span>
            </td>
            <td className="p-4 font-bold text-cyan-400">₹{order.price}</td>
            <td className="p-4">{order.customerEmail}</td>
            <td className="p-4">
              <span
                className={`font-semibold ${
                  order.status === 'DELIVERED'
                    ? 'text-green-400'
                    : order.status === 'PENDING'
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }`}
              >
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


// --- Main SellerDashboard ---
export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [allProducts, setAllProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentProduct, setCurrentProduct] = useState(null);
  const navigate = useNavigate();

  const shopkeeperId = localStorage.getItem('shopKeeperId');

  // Fetch orders
useEffect(() => {
  if (activeTab === 'orders') {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/products/shopkeeper/${shopkeeperId}/orders`
        );

        // Map raw array data to readable objects
        const formattedOrders = res.data.map((order) => ({
          orderId: order[0],
          status: order[1],
          productId: order[2],
          productName: order[3],
          price: order[4],
          imageUrl: order[5],
          description: order[6],
          rating: order[7],
          customerId: order[8],
          customerEmail: order[9],
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }
}, [shopkeeperId, activeTab]);

  const handleAddProduct = async (productData) => {
    try {
      await axios.post(
        `http://localhost:8080/api/products/create/${shopkeeperId}`,
        productData
      );
      alert('✅ Product added successfully!');
      const res = await axios.get(
        `http://localhost:8080/api/products/shopkeeper/${shopkeeperId}`
      );
      setAllProducts(res.data);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('❌ Failed to add product.');
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDelete = async (productId) => {
    if (window.confirm('Delete this product?')) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${productId}`);
        setAllProducts(allProducts.filter((p) => p.id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Seller Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              <FaPlus />
              <span>Add Product</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* --- Tabs --- */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <FaBoxOpen />
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <FaShoppingBag />
            <span>View Orders</span>
          </button>
        </div>

        {/* --- Active Tab Content --- */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {activeTab === 'products' ? (
            <ProductsTab
              allProducts={allProducts}
              onOpenEditModal={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ) : (
            <OrdersTab orders={orders} />
          )}
        </div>
      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddProduct}
        product={currentProduct}
        mode={modalMode}
      />
    </>
  );
}
