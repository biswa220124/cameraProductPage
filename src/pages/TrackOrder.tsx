import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, PackageOpen, Truck, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function TrackOrder() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const savedOrder = localStorage.getItem('aurex_latest_order');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (order && (loginInput.trim().toLowerCase() === order.customer.email.trim().toLowerCase() || loginInput.trim() === order.customer.phone.trim())) {
          setIsAuthenticated(true);
          setLoginError('');
      } else {
          setLoginError('No active order matches this detail.');
      }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f1f3f5] text-black flex flex-col items-center justify-center p-4 font-sans tracking-tight">
        <div className="max-w-[420px] w-full bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 relative overflow-hidden">
           {/* Decorative Top Line */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
           
           <h2 className="text-2xl font-bold mb-3 tracking-tight">Track Your Gear</h2>
           <p className="text-gray-500 mb-8 text-[13px] leading-relaxed">Enter the email address or phone number you provided during checkout to securely access your latest tracking timeline.</p>
           
           <form onSubmit={handleLogin}>
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email or Phone</label>
                  <input 
                    type="text" 
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="e.g. rohan@example.com or 9876543210"
                    className="w-full bg-[#f8f9fa] border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-3.5 rounded-lg transition-all text-sm text-black placeholder:text-gray-400"
                    required
                  />
                  {loginError && <p className="text-red-500 text-xs font-medium mt-2 animate-in fade-in">{loginError}</p>}
              </div>

              <button type="submit" className="w-full mt-6 py-3.5 bg-black hover:bg-gray-800 text-white font-bold rounded-lg transition-all shadow-md shadow-black/10">
                 Access Tracker
              </button>
           </form>
           
           <div className="mt-8 pt-6 border-t border-gray-100">
               <button onClick={() => navigate('/')} className="text-sm font-semibold text-gray-400 hover:text-black w-full text-center transition-colors flex justify-center items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Return to Store
               </button>
           </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;
  
  // Create mock dates for the timeline based on order date
  const orderDate = new Date(order.date);
  const formatDate = (date: Date) => date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (date: Date) => date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // For visual sake, we'll assume it's currently "Packed"
  const trackingSteps = [
    { id: 1, title: 'Order Placed', date: formatDate(orderDate), active: true, icon: ShoppingCart },
    { id: 2, title: 'Order Packed', date: formatDate(new Date(orderDate.getTime() + 86400000)), active: true, icon: PackageOpen },
    { id: 3, title: 'In Transit', date: 'Pending', active: false, icon: Truck },
    { id: 4, title: 'Out for delivery', date: 'Pending', active: false, icon: MapPin },
    { id: 5, title: 'Delivered', date: 'Pending', active: false, icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f5] text-black py-10 px-4 md:py-16 md:px-8 flex justify-center font-sans">
       <div className="w-full max-w-[1000px]">
          
          <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors uppercase tracking-wider">
             <ArrowLeft className="w-4 h-4" /> Back to Store
          </button>
          
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
             
             {/* Header */}
             <div className="p-8 md:p-10 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
                  <button className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-md">
                     Download Invoice <span className="ml-2">📄</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
                   <div>
                      <p className="text-gray-400 font-medium mb-1">Order Number</p>
                      <p className="font-bold whitespace-nowrap overflow-hidden text-ellipsis" title={order.orderId}>{order.orderId}</p>
                   </div>
                   <div>
                      <p className="text-gray-400 font-medium mb-1">Order Placed</p>
                      <p className="font-bold">{formatDate(orderDate)}</p>
                   </div>
                   <div>
                      <p className="text-gray-400 font-medium mb-1">Order Delivered</p>
                      <p className="font-bold">—</p>
                   </div>
                   <div>
                      <p className="text-gray-400 font-medium mb-1">No of items</p>
                      <p className="font-bold">{order.items.length} items</p>
                   </div>
                   <div>
                      <p className="text-gray-400 font-medium mb-1">Status</p>
                      <p className="font-bold text-orange-500">{order.status === 'processing' ? 'Processing' : 'Confirmed'}</p>
                   </div>
                </div>
             </div>

             {/* Horizontal Timeline */}
             <div className="p-8 md:p-12 border-b border-gray-100 bg-[#fafafa]">
                 <div className="flex justify-between items-center mb-10">
                    <h2 className="text-lg font-bold">Order Tracking</h2>
                    <span className="text-sm font-medium text-gray-400">Tracking ID #AUREX-{order.orderId.substring(order.orderId.length - 6).toUpperCase()}</span>
                 </div>

                 <div className="relative">
                    {/* The connecting lines */}
                    <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-gray-200 rounded-full z-0"></div>
                    <div className="absolute top-6 left-[10%] w-[25%] h-1 bg-orange-500 rounded-full z-0 transition-all duration-1000"></div>

                    {/* The Steps */}
                    <div className="relative z-10 flex justify-between">
                       {trackingSteps.map((step, index) => (
                          <div key={step.id} className="flex flex-col items-center w-1/5 relative">
                             {/* Icon Circle */}
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${step.active ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-gray-100 text-gray-300 border-2 border-white'}`}>
                                <step.icon className="w-5 h-5" />
                             </div>
                             
                             {/* Text */}
                             <h3 className={`text-[13px] font-bold text-center mb-1 ${step.active ? 'text-black' : 'text-gray-400'}`}>
                                {step.title}
                             </h3>
                             <p className={`text-[11px] font-medium text-center ${step.active ? 'text-gray-500' : 'text-gray-300'}`}>
                                {step.date}
                             </p>
                          </div>
                       ))}
                    </div>
                 </div>
             </div>

             {/* Order Items Table */}
             <div className="p-8 md:p-10">
                 <h2 className="text-lg font-bold mb-6">Items from the order</h2>
                 
                 <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-3 text-right">Total Price</div>
                 </div>

                 <div className="space-y-6">
                    {order.items.map((item: any) => (
                       <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                             <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                                <img src={item.img} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                             </div>
                             <div>
                                <h3 className="font-bold text-black mb-1">{item.name}</h3>
                                <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                             </div>
                          </div>
                          
                          <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center text-sm font-bold">
                             <span className="md:hidden text-gray-400">Qty:</span>
                             {item.qty}
                          </div>
                          
                          <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center text-sm font-bold">
                             <span className="md:hidden text-gray-400">Total:</span>
                             {formatPrice(item.price * item.qty)}
                          </div>
                       </div>
                    ))}
                 </div>

                 {/* Bottom Totals */}
                 <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 w-full md:w-auto">
                        <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Delivery Address</h4>
                        <div className="text-sm font-medium text-gray-800">
                           <p className="font-bold mb-1">{order.customer.name}</p>
                           <p className="text-gray-600">{order.customer.address}, {order.customer.city}</p>
                           <p className="text-gray-600">{order.customer.state} - {order.customer.pincode}</p>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-64 space-y-3 text-sm font-bold">
                       <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span>
                          <span className="text-black">{formatPrice(order.total)}</span>
                       </div>
                       <div className="flex justify-between text-gray-500 pb-3 border-b border-gray-100">
                          <span>Shipping</span>
                          <span className="text-black">Free</span>
                       </div>
                       <div className="flex justify-between text-lg pt-1">
                          <span>Total</span>
                          <span className="text-orange-500">{formatPrice(order.total)}</span>
                       </div>
                    </div>
                 </div>

             </div>
             
          </div>
       </div>
    </div>
  );
}
