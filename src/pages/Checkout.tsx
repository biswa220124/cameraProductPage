import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, CreditCard, Ticket, CheckCircle2, Truck } from 'lucide-react';
import cameraImg from '@/assets/camera-main.png';

export default function Checkout() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [customer, setCustomer] = useState({ 
      name: 'Rohan Sharma', 
      email: 'rohan.sharma@example.com', 
      phone: '9876543210', 
  });

  const [shipping, setShipping] = useState({
      address: 'Seawoods Estates, Nerul', 
      state: 'MH', 
      city: 'Navi Mumbai', 
      pincode: '400706' 
  });

  const [billing, setBilling] = useState({
      address: '', 
      state: 'MH', 
      city: '', 
      pincode: '' 
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "AUREX ONE Body", desc: "Professional Mirrorless", specs: "Full-Frame • Stellar Black", price: 289990, img: cameraImg, qty: 1 },
    { id: 2, name: "Premium Leather Half-Case", desc: "Handcrafted Leather", specs: "", price: 10990, img: "https://images.unsplash.com/photo-1544007380-4965adba2cf3?auto=format&fit=crop&q=80&w=150", qty: 1 }
  ]);

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
        if (item.id === id) {
            const newQty = Math.max(1, Math.min(10, item.qty + delta));
            return { ...item, qty: newQty };
        }
        return item;
    }));
  };

  const handleApplyDiscount = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!discountInput) return;
    if (discountInput.toLowerCase() === 'aurex') {
      setAppliedDiscount('aurex');
    } else {
      alert("Invalid discount code. Try 'AUREX'");
      setAppliedDiscount('');
    }
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0), [cartItems]);
  const discountAmount = useMemo(() => appliedDiscount === 'aurex' ? Math.floor(subtotal * 0.1) : 0, [subtotal, appliedDiscount]);
  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    setIsProcessing(true);
    
    try {
        const orderResponse = await fetch('http://localhost:5000/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cartItems, discountCode: appliedDiscount })
        });
        if (!orderResponse.ok) throw new Error("Failed to create order");
        const orderData = await orderResponse.json();

        const options = {
            key: "rzp_test_ScRW13ONeYNHKj",
            amount: orderData.amount,
            currency: orderData.currency,
            name: "AUREX ONE",
            description: "AUREX Checkout",
            image: cameraImg,
            order_id: orderData.id,
            handler: async function (response: any) {
                setIsProcessing(true);
                try {
                    const verifyResponse = await fetch('http://localhost:5000/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response)
                    });
                    if (verifyResponse.ok) {
                        const finalAddress = sameAsShipping ? shipping : billing;
                        
                        const orderRecord = {
                            orderId: orderData.id,
                            paymentId: response.razorpay_payment_id,
                            date: new Date().toISOString(),
                            items: cartItems,
                            total: total,
                            customer: { ...customer, ...finalAddress },
                            status: 'processing'
                        };
                        localStorage.setItem('aurex_latest_order', JSON.stringify(orderRecord));
                        setOrderSuccess(true);
                    } else {
                        alert('Payment verification failed!');
                    }
                } catch (err) {
                    console.error(err);
                    alert("Verification error.");
                } finally {
                    setIsProcessing(false);
                }
            },
            prefill: {
                name: customer.name,
                email: customer.email,
                contact: customer.phone
            },
            theme: { color: "#f97316" }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
            alert("Payment Failed: " + response.error.description);
            setIsProcessing(false);
        });
        rzp.open();
    } catch (error) {
        console.error(error);
        alert("Failed to initialize payment gateway.");
        setIsProcessing(false);
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomer(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setBilling(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const simulateDirectSuccess = () => {
    const finalAddress = sameAsShipping ? shipping : billing;
    const orderRecord = {
        orderId: `order_sim_${Math.floor(Math.random()*1000000)}`,
        paymentId: `pay_sim_${Math.floor(Math.random()*1000000)}`,
        date: new Date().toISOString(),
        items: cartItems,
        total: total,
        customer: { ...customer, ...finalAddress },
        status: 'processing'
    };
    localStorage.setItem('aurex_latest_order', JSON.stringify(orderRecord));
    setOrderSuccess(true);
  };

  if (orderSuccess) {
      return (
          <div className="min-h-screen bg-[#f8f9fa] text-black flex flex-col items-center justify-center p-4">
             <div className="w-24 h-24 bg-green-100 border border-green-200 rounded-full flex items-center justify-center animate-bounce mb-8 shadow-xl">
                 <CheckCircle2 className="w-12 h-12 text-green-500" />
             </div>
             <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter text-center">Payment Successful!</h1>
             <p className="text-gray-500 mb-10 text-center max-w-sm">Your precision gear order has been placed securely. We are preparing it for domestic shipment.</p>
             <button onClick={() => navigate('/track-order')} className="px-8 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
                Track Your Order
             </button>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f5] text-gray-900 selection:bg-orange-500/20 flex justify-center py-10 md:py-16 px-4 font-sans tracking-tight">
      
      <div className="w-full max-w-[1100px] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Column: Order Summary */}
        <div className="w-full md:w-5/12 bg-[#fafafa] p-8 md:p-10 flex flex-col border-r border-gray-200">
          
           <div className="flex items-center gap-3 mb-10 text-sm font-medium text-gray-500">
              <button onClick={() => navigate('/')} className="w-7 h-7 rounded-md bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm">
                <X className="w-3 h-3 text-black" />
              </button>
              <span>Shopping Cart / <span className="text-black font-semibold">Checkout</span></span>
           </div>

           <div className="flex items-center gap-3 mb-8">
             <h2 className="text-xl font-bold tracking-tight text-black">Order Summary</h2>
             <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 font-bold text-[11px] uppercase tracking-wider">{cartItems.length} items</span>
           </div>

           {/* Items List */}
           <div className="space-y-4 mb-8">
             {cartItems.length === 0 && (
                 <p className="text-gray-500 text-sm text-center py-6 border border-dashed border-gray-300 rounded-lg">Your cart is empty</p>
             )}
             
             {cartItems.map((item) => (
                <div key={item.id} className="relative p-4 rounded-xl border border-gray-200 bg-white flex gap-4 pr-10 shadow-sm transition-shadow hover:shadow-md">
                   <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden relative border border-gray-200/50">
                     <img src={item.img} alt={item.name} className={item.id === 1 ? "w-[120%] object-contain mix-blend-multiply" : "w-full h-full object-cover mix-blend-multiply opacity-90"} />
                   </div>
                   <div className="flex-1">
                     <h3 className="font-bold text-[14px] leading-tight text-black mb-1">{item.name}</h3>
                     <p className="text-[12px] text-gray-500 mb-2 font-medium">{item.desc}</p>
                     <div className="flex items-center justify-between w-full mt-2">
                       <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-1 py-1 select-none">
                         <button type="button" onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-black px-1.5 font-medium">-</button>
                         <span className="text-xs text-black w-4 text-center font-bold">{item.qty}</span>
                         <button type="button" onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-black px-1.5 font-medium">+</button>
                       </div>
                       <span className="font-bold">{formatPrice(item.price * item.qty)}</span>
                     </div>
                   </div>
                   <button onClick={() => handleRemoveItem(item.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                   </button>
                </div>
             ))}
           </div>

           {/* Discount Code */}
           <div className="mb-8 relative group">
              <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center justify-between overflow-hidden">
                  {appliedDiscount ? (
                      <div className="flex items-center justify-between w-full relative z-10">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                  <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <div>
                                  <h4 className="text-sm font-bold text-black">Discount applied!</h4>
                                  <p className="text-xs font-semibold text-green-600">10% off entire order</p>
                              </div>
                          </div>
                          <button onClick={() => setAppliedDiscount('')} className="bg-white hover:bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors">
                              Remove
                          </button>
                      </div>
                  ) : (
                      <form onSubmit={handleApplyDiscount} className="flex items-center w-full gap-3 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                              <Ticket className="w-4 h-4" />
                          </div>
                          <input 
                              type="text" 
                              placeholder="Promo code (try 'AUREX')" 
                              value={discountInput}
                              onChange={(e) => setDiscountInput(e.target.value)}
                              className="bg-transparent border-b border-gray-200 focus:border-green-500 outline-none text-sm font-medium text-black px-2 py-1 flex-1 placeholder:text-gray-400 placeholder:font-normal transition-colors"
                          />
                          <button type="submit" className="shrink-0 bg-black hover:bg-gray-800 rounded-md px-4 py-1.5 text-xs font-bold text-white transition-colors">
                              Apply
                          </button>
                      </form>
                  )}
              </div>
           </div>

           {/* Reassurance Marquee */}
           <div className="w-full overflow-hidden whitespace-nowrap bg-white py-3 border border-gray-100 shadow-sm rounded-xl relative select-none flex items-center mb-8">
               {/* Fade overlays for smooth entry/exit effect */}
               <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
               <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
               
               <div className="inline-block animate-marquee">
                   {[1, 2, 3, 4].map((group) => (
                       <span key={group} className="inline-flex items-center space-x-3 px-1.5">
                           <span className="px-3 py-1.5 bg-[#f8f9fa] border border-gray-200 rounded-full text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">Easy Returns</span>
                           <span className="px-3 py-1.5 bg-[#f8f9fa] border border-gray-200 rounded-full text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">Fast Shipping</span>
                           <span className="px-3 py-1.5 bg-[#f8f9fa] border border-gray-200 rounded-full text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">1 Year Warranty</span>
                           <span className="px-3 py-1.5 bg-[#f8f9fa] border border-gray-200 rounded-full text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">24/7 Support</span>
                       </span>
                   ))}
               </div>
           </div>
           {/* Totals */}
           <div className="space-y-4 pt-6 border-t border-gray-200 text-[14px] font-semibold mt-auto">
              <div className="flex justify-between items-center text-gray-500">
                <span>Subtotal</span>
                <span className="text-black">{formatPrice(subtotal)}</span>
              </div>
              
              {appliedDiscount && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount (10%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
              )}

              <div className="flex justify-between items-center text-gray-500">
                <span>Shipping</span>
                <span className="text-black">Free</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-2">
                <span className="font-bold text-black text-lg">Total</span>
                <span className="font-bold text-black text-xl">{formatPrice(total)}</span>
              </div>
           </div>

        </div>

        {/* Right Column: Checkout Form Detailed Input */}
        <div className="w-full md:w-7/12 p-8 md:p-10 lg:p-12 flex flex-col bg-white overflow-y-auto">
          <form id="checkout-form" onSubmit={handleSubmit} className="w-full max-w-[420px] mx-auto relative flex flex-col gap-10">
            
            {/* 1. Customer Details */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">1</div>
                    <h3 className="text-lg font-bold text-black">Customer Information</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input required type="text" name="name" value={customer.name} onChange={handleCustomerChange} className="w-full bg-[#f8f9fa] border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-3 rounded-lg transition-all text-sm font-medium text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Email address</label>
                    <input required type="email" name="email" value={customer.email} onChange={handleCustomerChange} className="w-full bg-[#f8f9fa] border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-3 rounded-lg transition-all text-sm font-medium text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
                    <input required type="tel" name="phone" value={customer.phone} onChange={handleCustomerChange} className="w-full bg-[#f8f9fa] border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-3 rounded-lg transition-all text-sm font-medium text-black" />
                  </div>
                </div>
            </section>

            {/* 2. Shipping Address */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">2</div>
                    <h3 className="text-lg font-bold text-black">Shipping Address</h3>
                </div>
                <div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-[#f8f9fa] focus-within:border-orange-500 transition-all shadow-sm">
                      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center text-sm font-bold text-black bg-white">
                         <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-orange-500" /> India</span>
                      </div>
                      <div className="flex flex-col text-sm font-medium text-black">
                          <input required type="text" name="address" placeholder="Address line 1" value={shipping.address} onChange={handleShippingChange} className="border-b border-gray-200 bg-transparent outline-none px-4 py-3 text-black focus:bg-white transition-colors" />
                          <div className="flex border-b border-gray-200">
                            <input required type="text" name="city" placeholder="City" value={shipping.city} onChange={handleShippingChange} className="w-1/2 border-r border-gray-200 bg-transparent outline-none px-4 py-3 text-black focus:bg-white transition-colors" />
                            <select name="state" value={shipping.state} onChange={handleShippingChange} className="w-1/2 bg-transparent outline-none px-4 py-3 text-black focus:bg-white transition-colors appearance-none cursor-pointer">
                                <option value="MH">Maharashtra</option>
                                <option value="DL">Delhi</option>
                                <option value="KA">Karnataka</option>
                                <option value="TN">Tamil Nadu</option>
                                <option value="WB">West Bengal</option>
                                <option value="RJ">Rajasthan</option>
                                <option value="GJ">Gujarat</option>
                            </select>
                          </div>
                          <input required type="text" name="pincode" placeholder="PIN Code" value={shipping.pincode} onChange={handleShippingChange} className="bg-transparent outline-none px-4 py-3 text-black focus:bg-white transition-colors" />
                      </div>
                    </div>
                </div>
            </section>

            {/* 3. Billing Address */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">3</div>
                    <h3 className="text-lg font-bold text-black">Billing Address</h3>
                </div>
                <div>
                    <label className="flex items-center gap-3 cursor-pointer mb-5">
                        <input 
                            type="checkbox" 
                            checked={sameAsShipping} 
                            onChange={(e) => setSameAsShipping(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 bg-white"
                        />
                        <span className="text-sm font-semibold text-gray-700">Same as shipping address</span>
                    </label>

                    {!sameAsShipping && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-[#f8f9fa] focus-within:border-orange-500 transition-all shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex flex-col text-sm font-medium text-black">
                              <input required type="text" name="address" placeholder="Address line 1" value={billing.address} onChange={handleBillingChange} className="border-b border-gray-200 bg-transparent outline-none px-4 py-3 text-black focus:bg-white transition-colors" />
                              <div className="flex border-b border-gray-200">
                                <input required type="text" name="city" placeholder="City" value={billing.city} onChange={handleBillingChange} className="w-1/2 border-r border-gray-200 bg-transparent outline-none px-4 py-3 text-black focus:bg-white transition-colors" />
                                <select name="state" value={billing.state} onChange={handleBillingChange} className="w-1/2 bg-transparent outline-none px-4 py-3 text-black focus:bg-white transition-colors appearance-none cursor-pointer">
                                    <option value="MH">Maharashtra</option>
                                    <option value="DL">Delhi</option>
                                    <option value="KA">Karnataka</option>
                                    <option value="TN">Tamil Nadu</option>
                                    <option value="WB">West Bengal</option>
                                    <option value="RJ">Rajasthan</option>
                                    <option value="GJ">Gujarat</option>
                                </select>
                              </div>
                              <input required type="text" name="pincode" placeholder="PIN Code" value={billing.pincode} onChange={handleBillingChange} className="bg-transparent outline-none px-4 py-3 text-black focus:bg-white transition-colors" />
                          </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Payment */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">4</div>
                    <h3 className="text-lg font-bold text-black">Secure Payment</h3>
                </div>
                <div>
                    <div className="flex items-center gap-4 p-5 bg-[#fafafa] rounded-xl border border-gray-200 shadow-inner">
                       <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                           <CreditCard className="w-6 h-6" />
                       </div>
                       <div>
                           <h3 className="text-sm font-bold text-black tracking-wide mb-0.5">Pay with Razorpay</h3>
                           <p className="text-xs font-medium text-gray-500">Supports Cards, UPI, and Netbanking securely.</p>
                       </div>
                    </div>
                </div>
            </section>


            {/* Submit Block */}
            <div className="pt-6 mt-2 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Grand Total</span>
                <span className="text-2xl font-black text-black">{formatPrice(total)}</span>
              </div>
              
              <button 
                type="submit" 
                disabled={isProcessing || cartItems.length === 0}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.6)] transition-all font-bold text-[15px] rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Connecting gateway...' : `Pay ${formatPrice(total)}`}
                {!isProcessing && <Lock className="w-4 h-4 ml-1" />}
              </button>

              <button 
                type="button" 
                onClick={simulateDirectSuccess}
                className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-black border border-gray-200 transition-colors rounded-lg text-[12px] font-bold tracking-wider mt-3 flex items-center justify-center gap-2"
              >
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-black uppercase tracking-widest">Demo</span>
                Simulate Successful Payment (Test Mode)
              </button>

              <div className="flex items-center justify-center gap-2 pt-6 text-[11px] font-semibold text-gray-400">
                 <Lock className="w-3 h-3" />
                 <span>Payments 100% secured by Razorpay API</span>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
