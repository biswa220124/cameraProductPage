import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, CreditCard, Ticket, ChevronDown, CheckCircle2 } from 'lucide-react';
import cameraImg from '@/assets/camera-main.png';

export default function Checkout() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardMethod, setCardMethod] = useState<'card' | 'apple' | 'google' | 'alipay'>('card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Checkout completed via Stripe!');
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4f4f5] selection:bg-primary/30 flex justify-center py-10 md:py-20 px-4">
      
      {/* Checkout Container matching the dark overlay design */}
      <div className="w-full max-w-[1200px] bg-[#111113] rounded-2xl border border-[#27272a] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        
        {/* Left Column: Order Summary */}
        <div className="w-full md:w-5/12 bg-[#0c0c0e] p-8 md:p-10 flex flex-col border-r border-[#27272a]">
          
           <div className="flex items-center gap-3 mb-10 text-sm font-medium text-[#a1a1aa]">
              <button onClick={() => navigate('/')} className="w-6 h-6 rounded-md bg-[#27272a] hover:bg-[#3f3f46] flex items-center justify-center transition-colors">
                <X className="w-3 h-3" />
              </button>
              <span>Shopping Cart / <span className="text-white">Checkout</span></span>
           </div>

           <div className="flex items-center gap-3 mb-8">
             <h2 className="text-2xl font-semibold tracking-tight text-white">Order Summary</h2>
             <span className="px-2 py-0.5 rounded-full bg-[#27272a] text-[#a1a1aa] text-xs">2 items</span>
           </div>

           {/* Items List */}
           <div className="space-y-4 mb-8">
             
             {/* Main Item */}
             <div className="relative p-4 rounded-xl border border-[#27272a] bg-[#18181b] flex gap-4 pr-10">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#111] flex items-center justify-center shrink-0">
                  <img src={cameraImg} alt="AUREX ONE" className="w-[120%] object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[15px] leading-tight text-white mb-1">AUREX ONE Body</h3>
                  <p className="text-[12px] text-[#a1a1aa] mb-2">Professional Mirrorless</p>
                  <div className="flex items-center gap-3 text-[11px] text-[#a1a1aa] mb-3">
                    <span>Full-Frame</span> <span className="w-0.5 h-0.5 rounded-full bg-[#52525b]"></span>
                    <span>Stellar Black</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 bg-[#27272a] rounded-md px-2 py-1 cursor-pointer hover:bg-[#3f3f46] transition-colors">
                      <span className="text-xs text-[#a1a1aa]">Qty 1</span>
                      <ChevronDown className="w-3 h-3 text-[#a1a1aa]" />
                    </div>
                    <span className="font-medium">$3,499.00</span>
                  </div>
                </div>
                <button className="absolute top-3 right-3 text-[#52525b] hover:text-[#a1a1aa]">
                   <X className="w-4 h-4" />
                </button>
             </div>

             {/* Accessory Item */}
             <div className="relative p-4 rounded-xl border border-[#27272a] bg-[#18181b] flex gap-4 pr-10">
                <div className="w-16 h-16 rounded-lg bg-[#111] flex items-center justify-center shrink-0 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1544007380-4965adba2cf3?auto=format&fit=crop&q=80&w=150" alt="Case" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[15px] leading-tight text-white mb-1">Premium Leather Half-Case</h3>
                  <p className="text-[12px] text-[#a1a1aa] mb-3">Handcrafted Leather</p>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 bg-[#27272a] rounded-md px-2 py-1 cursor-pointer hover:bg-[#3f3f46] transition-colors">
                      <span className="text-xs text-[#a1a1aa]">Qty 1</span>
                      <ChevronDown className="w-3 h-3 text-[#a1a1aa]" />
                    </div>
                    <span className="font-medium">$129.00</span>
                  </div>
                </div>
                <button className="absolute top-3 right-3 text-[#52525b] hover:text-[#a1a1aa]">
                   <X className="w-4 h-4" />
                </button>
             </div>

           </div>

           {/* Discount Code */}
           <div className="mb-8 p-4 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#18181b] flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#272740] text-[#818cf8] flex items-center justify-center">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Discount code</h4>
                  <p className="text-xs text-[#a1a1aa]">AUREX Member Promo</p>
                </div>
              </div>
              <button className="relative z-10 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors">
                Add code
              </button>
           </div>

           {/* Totals */}
           <div className="space-y-4 pt-6 border-t border-[#27272a] text-[15px]">
              <div className="flex justify-between items-center text-[#a1a1aa]">
                <span>Subtotal</span>
                <span className="font-medium text-white">$3,628.00</span>
              </div>
              <div className="flex justify-between items-center text-[#a1a1aa]">
                <span>Shipping</span>
                <span className="text-white">Free</span>
              </div>
              <div className="flex justify-between items-center text-[#a1a1aa]">
                <span className="flex items-center gap-1">Tax <span className="text-[10px] w-4 h-4 rounded-full border border-[#52525b] flex items-center justify-center text-[#52525b]">i</span></span>
                <span className="text-white">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#27272a] mt-2">
                <span className="font-semibold text-white">Total</span>
                <span className="font-bold text-white text-lg">$3,628.00</span>
              </div>
           </div>

        </div>

        {/* Right Column: Checkout Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col bg-[#111113]">
          <form id="checkout-form" onSubmit={handleSubmit} className="w-full max-w-md mx-auto relative h-full flex flex-col">
            
            {/* Top Toggles */}
            <div className="flex p-1 bg-[#18181b] rounded-lg border border-[#27272a] mb-8">
               <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${paymentMethod === 'card' ? 'bg-[#27272a] text-white shadow-sm' : 'text-[#a1a1aa] hover:text-white'}`}>
                 Pay by Card
               </button>
               <button type="button" onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${paymentMethod === 'paypal' ? 'bg-[#27272a] text-white shadow-sm' : 'text-[#a1a1aa] hover:text-white'}`}>
                 PayPal
               </button>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              <button type="button" onClick={() => setCardMethod('card')} className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border transition-all ${cardMethod === 'card' ? 'border-[#3b82f6] bg-[#1d4ed8]/10 text-white' : 'border-[#27272a] bg-[#18181b] text-[#a1a1aa] hover:border-[#3f3f46]'}`}>
                 <CreditCard className={`w-5 h-5 ${cardMethod === 'card' ? 'text-[#3b82f6]' : ''}`} />
                 <span className="text-[10px] font-medium">Card</span>
              </button>
              <button type="button" onClick={() => setCardMethod('apple')} className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border transition-all ${cardMethod === 'apple' ? 'border-[#3b82f6] bg-[#1d4ed8]/10 text-white' : 'border-[#27272a] bg-[#18181b] text-[#a1a1aa] hover:border-[#3f3f46]'}`}>
                 <div className="w-5 h-5 flex items-center justify-center font-bold text-sm"></div>
                 <span className="text-[10px] font-medium">Apple Pay</span>
              </button>
              <button type="button" onClick={() => setCardMethod('google')} className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border transition-all ${cardMethod === 'google' ? 'border-[#3b82f6] bg-[#1d4ed8]/10 text-white' : 'border-[#27272a] bg-[#18181b] text-[#a1a1aa] hover:border-[#3f3f46]'}`}>
                 <span className="font-bold text-[#ea4335] text-xs">G<span className="text-white">Pay</span></span>
                 <span className="text-[10px] font-medium">Google Pay</span>
              </button>
              <button type="button" onClick={() => setCardMethod('alipay')} className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border transition-all ${cardMethod === 'alipay' ? 'border-[#3b82f6] bg-[#1d4ed8]/10 text-white' : 'border-[#27272a] bg-[#18181b] text-[#a1a1aa] hover:border-[#3f3f46]'}`}>
                 <span className="font-bold text-[#0ea5e9] text-xs">Alipay</span>
                 <span className="text-[10px] font-medium">Alipay</span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-6 text-[#a1a1aa] text-xs">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure payment link <ChevronDown className="w-3 h-3" /></span>
              <a href="#" className="hover:text-white transition-colors">Learn more</a>
            </div>

            <div className="space-y-5 flex-1">
              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Email address</label>
                <input required type="email" defaultValue="jenny@example.com" className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] outline-none px-3 py-2 rounded-md transition-all text-sm text-white" />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Card number</label>
                <div className="relative">
                  <input required type="text" defaultValue="1234 1234 1234 1234" className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] outline-none px-3 py-2 pr-20 rounded-md transition-all text-sm text-white" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                     <span className="px-1 py-0.5 rounded text-[8px] bg-blue-900 border border-blue-700 text-white font-bold">VISA</span>
                     <span className="px-1 py-0.5 rounded text-[8px] bg-[#111] border border-[#27272a] flex items-center gap-0.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 -ml-1"></span>
                     </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Expiration date</label>
                  <input required type="text" defaultValue="10 / 2024" className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] outline-none px-3 py-2 rounded-md transition-all text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Security code</label>
                  <div className="relative">
                    <input required type="text" defaultValue="135" className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] outline-none px-3 py-2 pr-8 rounded-md transition-all text-sm text-white" />
                    <CreditCard className="w-3.5 h-3.5 text-[#52525b] absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Cardholder name</label>
                <input required type="text" defaultValue="Jenny Rosen" className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] outline-none px-3 py-2 rounded-md transition-all text-sm text-white" />
              </div>

              <div className="pt-2">
                <div className="border border-[#27272a] rounded-md overflow-hidden bg-[#18181b]">
                  <div className="px-3 py-2 border-b border-[#27272a] flex justify-between items-center">
                     <span className="text-sm flex items-center gap-2"><span className="text-lg leading-none">🇺🇸</span> United States</span>
                     <ChevronDown className="w-4 h-4 text-[#52525b]" />
                  </div>
                  <div className="px-3 py-2 border-b border-[#27272a] flex justify-between items-center text-sm text-[#d4d4d8]">
                     <span>27 Fredrick Ave Brothers</span>
                     <button type="button" className="text-xs text-[#a1a1aa] hover:text-white">Clear</button>
                  </div>
                  <div className="px-3 py-2 border-b border-[#27272a] flex justify-between items-center text-sm text-[#d4d4d8]">
                     <span>California</span>
                     <ChevronDown className="w-4 h-4 text-[#52525b]" />
                  </div>
                  <div className="flex">
                    <input required type="text" defaultValue="Los Angeles" className="w-1/2 bg-transparent border-r border-[#27272a] outline-none px-3 py-2 text-sm text-white focus:bg-[#27272a]" />
                    <input required type="text" defaultValue="94025" className="w-1/2 bg-transparent outline-none px-3 py-2 text-sm text-white focus:bg-[#27272a]" />
                  </div>
                </div>
              </div>
              
              <div className="pt-2 mb-4">
                <label className="block text-[11px] font-medium text-[#a1a1aa] mb-1.5">Tax ID number (optional)</label>
                <input type="text" defaultValue="15978046" className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#3f3f46] focus:ring-1 focus:ring-[#3f3f46] outline-none px-3 py-2 rounded-md transition-all text-sm text-white" />
              </div>
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t border-[#27272a]">
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Subtotal</span>
                <span className="font-medium">$3,628.00</span>
              </div>
              <div className="flex justify-between text-sm font-semibold mb-6">
                <span>Total</span>
                <span>$3,628.00</span>
              </div>
              
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all font-medium rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing via Stripe...' : 'Pay $3,628.00'}
                {!isProcessing && <Lock className="w-3.5 h-3.5" />}
              </button>

              <div className="flex items-center justify-center gap-3 pt-3 text-[10px] text-[#52525b]">
                 <span>Powered by Stripe</span>
                 <span>•</span>
                 <a href="#" className="hover:text-[#a1a1aa]">Terms</a>
                 <span>•</span>
                 <a href="#" className="hover:text-[#a1a1aa]">Privacy</a>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
