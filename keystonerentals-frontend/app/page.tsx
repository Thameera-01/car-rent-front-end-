'use client';

import { useState, useEffect, useRef } from 'react';

interface Car {
  id: number;
  name: string;
  category: string;
  type: string;
  image: string;
  seats: number;
  transmission: string;
  ac: string;
  price: string | number;
  badge: string;
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

interface BookingStatus {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export default function Home() {
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // --- AI Chatbot States ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Hello! Welcome to Keystone Rentals. How can I help you find the perfect car today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        const data = await response.json();
        setCarsData(data);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Chat එකේ අලුත් මැසේජ් එකක් ආවාම ඉබේම යටට Scroll වීම
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const filteredCars = carsData.filter(car => {
    const matchesFilter = activeFilter === 'all' || car.category === activeFilter;
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const bookingData = {
      car_name: selectedCar?.name,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      message: formData.get('message')
    };

    try {
      setIsBookingSubmitting(true);
      setBookingStatus(null);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBookingStatus({
          type: 'success',
          title: 'Completed',
          message: `Thanks ${bookingData.name}! Your booking request for ${selectedCar?.name} has been received.`
        });
        e.currentTarget.reset();
      } else {
        setBookingStatus({
          type: 'error',
          title: 'Uncompleted',
          message: data?.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      console.error(error);
      setBookingStatus({
        type: 'error',
        title: 'Uncompleted',
        message: 'Connection error. Please check your internet.'
      });
    } finally {
      setIsBookingSubmitting(false);

      window.setTimeout(() => {
        setBookingStatus(null);
      }, 3000);
    }
  };

  // AI Chat මැසේජ් යැවීම
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.reply || 'Sorry, I could not generate a reply right now.'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden relative">
      
      {/* ----------------- AI CHATBOT UI ----------------- */}
      
      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-red-700 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-800 transition-transform transform hover:scale-110 border-4 border-white"
      >
        <span className="text-xl sm:text-2xl">{isChatOpen ? '✖' : '💬'}</span>
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-28 z-50 w-auto sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up max-h-[calc(100svh-6rem)] sm:max-h-none">
          {/* Header */}
          <div className="bg-red-700 text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <span className="bg-white text-red-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">AI</span>
              <div>
                <h3 className="font-bold leading-tight">Keystone Assistant</h3>
                <p className="text-xs text-red-200">Online 24/7</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-200 text-xl font-bold">✖</button>
          </div>
          
          {/* Messages Area */}
          <div ref={chatScrollRef} className="flex-1 p-4 h-80 sm:h-96 overflow-y-auto bg-gray-50 flex flex-col gap-4 scroll-smooth">
            {messages.map((msg, idx) => (
               <div key={idx} className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${msg.role === 'user' ? 'bg-red-700 text-white self-end rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none'}`}>
                 {msg.text}
               </div>
            ))}
            {isTyping && (
              <div className="text-xs text-gray-500 self-start bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                <span className="animate-bounce">●</span><span className="animate-bounce delay-100">●</span><span className="animate-bounce delay-200">●</span>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex gap-2">
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              placeholder="Ask me about our cars..." 
              className="flex-1 min-w-0 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-red-500 bg-gray-50" 
              required 
            />
            <button type="submit" className="bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-800 transition-colors">
              ➤
            </button>
          </form>
        </div>
      )}
      {/* --------------------------------------------------- */}

      {/* POPUP MODAL (තාවකාලික කාලය තෝරන පහසුකම සමඟ) */}
      {selectedCar && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92svh] flex flex-col md:flex-row overflow-hidden relative animate-[popupIn_220ms_ease-out]">
            {bookingStatus && (
              <div className={`absolute top-3 left-3 right-3 sm:top-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-20 sm:w-[calc(100%-2rem)] max-w-xl rounded-2xl px-4 py-3 shadow-lg border animate-[statusPop_260ms_ease-out] ${bookingStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-lg leading-none">{bookingStatus.type === 'success' ? '✓' : '!'}</div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-wide">{bookingStatus.title}</p>
                    <p className="text-sm mt-1">{bookingStatus.message}</p>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => setSelectedCar(null)} className="absolute top-4 right-4 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-800 w-8 h-8 rounded-full font-bold flex items-center justify-center transition z-10">✕</button>
            <div className="w-full md:w-1/2 bg-gray-100 p-5 sm:p-8 flex flex-col justify-center items-center text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{selectedCar.name}</h3>
              <p className="text-red-600 font-bold text-lg sm:text-xl mb-4">RS. {selectedCar.price} / day</p>
              <img src={selectedCar.image} alt={selectedCar.name} className="w-full max-w-xs rounded-xl shadow-md mb-4 object-cover h-40 sm:h-48" />
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 font-semibold">
                <span className="bg-white px-3 py-1 rounded-full border">Seats: {selectedCar.seats}</span>
                <span className="bg-white px-3 py-1 rounded-full border">{selectedCar.transmission}</span>
                <span className="bg-white px-3 py-1 rounded-full border">A/C: {selectedCar.ac}</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-5 sm:p-8 bg-white overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 border-b-2 border-red-600 inline-block pb-1">Book This Car</h2>
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <div><label className="block text-gray-700 font-bold mb-1 text-xs">Full Name</label><input type="text" name="name" required className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none focus:border-red-500 text-sm" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-gray-700 font-bold mb-1 text-xs">Email</label><input type="email" name="email" required className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none focus:border-red-500 text-sm" /></div>
                  <div><label className="block text-gray-700 font-bold mb-1 text-xs">Phone</label><input type="tel" name="phone" required className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none focus:border-red-500 text-sm" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-gray-700 font-bold mb-1 text-xs">Start Date</label><input type="date" name="start_date" required className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none focus:border-red-500 text-sm" /></div>
                  <div><label className="block text-gray-700 font-bold mb-1 text-xs">End Date</label><input type="date" name="end_date" required className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none focus:border-red-500 text-sm" /></div>
                </div>
                <div><label className="block text-gray-700 font-bold mb-1 text-xs">Notes</label><textarea name="message" rows={2} defaultValue={`I want to rent ${selectedCar.name}.`} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none focus:border-red-500 text-sm resize-none"></textarea></div>
                <button type="submit" disabled={isBookingSubmitting} className="w-full bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-800 transition shadow-lg mt-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                  {isBookingSubmitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative min-h-[100svh] flex items-center justify-center text-white text-center px-4 overflow-hidden scroll-mt-24 py-20 sm:py-0">
        <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-[-1] brightness-50">
          <source src="https://github.com/user-attachments/assets/7b52694d-8433-427d-879f-3cc6757c07e7" type="video/mp4" />
        </video>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight">Your Journey Starts Here</h1>
          <p className="text-base sm:text-lg md:text-2xl mb-8 px-2">Premium car rental service in the best rates and newest vehicles</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#ourcars" className="bg-red-700 hover:bg-red-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold transition transform hover:-translate-y-1 shadow-lg">Browse Cars</a>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="aboutus" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-100 text-center scroll-mt-24">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 border-b-2 border-gray-800 inline-block pb-2">About Us</h2>
        </div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="flex-1">
            <img src="https://github.com/user-attachments/assets/84f8ea00-f79a-4411-a580-fdb622952fbe" alt="About Us" className="w-full rounded-xl shadow-lg" />
          </div>
          <div className="flex-1 text-left bg-white p-5 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Keystone Rentals - Your Reliable Car Rental Service</h3>
            <p className="text-gray-600 leading-relaxed mb-4">At Keystone Rentals, we are committed to providing top notch car rental services that cater to your travel needs. With a diverse fleet of vehicles, competitive pricing, and exceptional customer service, we ensure a seamless rental experience from start to finish.</p>
            <p className="text-gray-600 leading-relaxed">Whether you're planning a weekend getaway, a business trip, or need a vehicle for daily commuting, Keystone Rentals has got you covered... Choose Keystone Rentals for your next adventure and experience the freedom of the open road with confidence and convenience.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-200 scroll-mt-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 border-b-2 border-gray-800 inline-block pb-2 mb-4">Why Choose Us?</h2>
          <p className="text-gray-600 text-base sm:text-lg">Experience the best car rental service with unmatched benefits</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { img: "0a471521-3ccc-46dc-94ee-563c6afad833", title: "Best Prices", desc: "Competitive rates with no hidden fees. Get the best value for your money with transparent pricing." },
            { img: "226f85e8-d055-4fca-918a-99b07b698e48", title: "Wide Selection", desc: "Choose from economy to luxury vehicles. Our diverse fleet ensures you find the perfect car." },
            { img: "5392dd27-646d-4d34-8725-23552653d9b9", title: "Easy Booking", desc: "Simple online reservation system. Book your car in minutes with our user-friendly platform." },
            { img: "b9b655ed-8222-4f93-84c1-a68a7b648a8a", title: "Safe & Secure", desc: "All vehicles regularly maintained and sanitized. Your safety is our top priority with comprehensive insurance." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl text-center shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <img src={`https://github.com/user-attachments/assets/${feature.img}`} alt={feature.title} className="w-40 sm:w-48 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Cars Section */}
      <section id="ourcars" className="py-16 sm:py-24 px-4 sm:px-6 bg-white scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 border-b-2 border-gray-800 inline-block pb-2">Our Cars</h2>
        </div>
        
        <div className="max-w-3xl mx-auto mb-10 text-center px-1 sm:px-0">
          <input 
            type="text" 
            placeholder="Search your car here..." 
            className="w-full md:w-2/3 px-5 sm:px-6 py-3 border-2 border-gray-200 rounded-full outline-none focus:border-red-500 mb-6"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {['all', 'sedan', 'suv', 'luxury', 'economy'].map(filter => (
              <button 
                key={filter} 
                onClick={() => setActiveFilter(filter)}
                className={`px-4 sm:px-6 py-2 border-2 border-red-500 rounded-full font-semibold capitalize transition-all text-sm sm:text-base ${activeFilter === filter ? 'bg-red-700 border-red-700 text-white' : 'text-red-500 hover:bg-red-700 hover:text-white'}`}
              >
                {filter === 'all' ? 'All Cars' : filter}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-xl font-bold text-gray-500">Loading cars from database...</div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
            {filteredCars.length > 0 ? filteredCars.map(car => (
              <div key={car.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden relative">
                <div className="h-48 sm:h-60 overflow-hidden relative flex items-center justify-center">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold">{car.badge}</span>
                </div>
                <div className="p-5 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{car.name}</h3>
                  <div className="text-red-500 font-bold text-sm mb-4">{car.type}</div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="text-xl sm:text-2xl font-bold text-red-500">RS.{car.price}<span className="text-sm text-gray-500 font-normal">/day</span></div>
                    <button onClick={() => setSelectedCar(car)} className="bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition w-full sm:w-auto">Book Now</button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-gray-500 py-10">No cars found.</div>
            )}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-800 text-white scroll-mt-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold border-b-2 border-white inline-block pb-2 mb-4">What Our Customers Feedback</h2>
          <p className="text-gray-300 text-base sm:text-lg">Real reviews from satisfied clients</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { name: "Dilan Perera", type: "Business Traveler", txt: "Excellent service! The car was in perfect condition and the booking process was incredibly smooth. Will definitely rent again!" },
            { name: "Malisha Dissanayake", type: "Family Vacation", txt: "Great prices and amazing customer support. They went above and beyond to ensure my family had a comfortable trip." },
            { name: "Mohomad Ali", type: "Weekend Traveler", txt: "Wide selection of vehicles and transparent pricing. No hidden fees! Highly recommend DriveEasy for all your rental needs." }
          ].map((review, idx) => (
            <div key={idx} className="bg-white text-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
              <p className="italic text-gray-600 mb-8 text-sm sm:text-base">"{review.txt}"</p>
              <div className="flex items-center gap-4">
                <img src="https://github.com/user-attachments/assets/2b3f96eb-cb57-4de3-b0b2-5875abcd2416" alt="user" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.type}</p>
                  <div className="text-yellow-400 mt-1">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 bg-white scroll-mt-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 border-b-2 border-gray-800 inline-block pb-2 mb-4">Contact Us</h2>
          <p className="text-gray-600 text-base sm:text-lg">Have questions? We're here to help!</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Contact Information</h3>
            <p className="text-gray-600 mb-8">Reach out to us to find the perfect vehicle for your journey.</p>
            <div className="space-y-5 sm:space-y-6">
              {[
                { label: "Address", val: "123 colombo road, colombo" },
                { label: "Phone", val: "+94 110000000" },
                { label: "Email", val: "info@keystonerentals.com" },
                { label: "Hours", val: "Mon - Sun: 8.00 a.m to 5.00 p.m" }
              ].map((info, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-red-700 font-bold">{idx + 1}</div>
                  <div>
                    <h4 className="font-bold text-gray-800">{info.label}</h4>
                    <p className="text-gray-600">{info.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-100 p-5 sm:p-8 rounded-2xl">
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-5 sm:mb-6">
                <label className="block mb-2 text-gray-800">Full Name</label>
                  <input type="text" name="name" required className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 outline-none focus:border-red-500 bg-white" />
              </div>
                <div className="mb-5 sm:mb-6">
                <label className="block mb-2 text-gray-800">Email</label>
                  <input type="email" name="email" required className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 outline-none focus:border-red-500 bg-white" />
              </div>
                <div className="mb-5 sm:mb-6">
                <label className="block mb-2 text-gray-800">Phone</label>
                  <input type="tel" name="phone" required className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 outline-none focus:border-red-500 bg-white" />
              </div>
                <div className="mb-5 sm:mb-6">
                <label className="block mb-2 text-gray-800">Message</label>
                  <textarea name="message" required rows={4} className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 outline-none focus:border-red-500 bg-white resize-none"></textarea>
              </div>
                <button type="submit" className="bg-red-700 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl font-bold transition w-full shadow-lg">Send Message</button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}