'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="text-2xl font-bold mb-6">About Keystone Rentals</h3>
          <p className="text-gray-400 leading-loose mb-6">Your trusted partner in car rentals. We provide premium vehicles at affordable prices with exceptional customer service.</p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition"><img src="https://github.com/user-attachments/assets/4584ce37-075e-41d7-8577-ffb9d7023c9f" className="w-5" alt="Facebook"/></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition"><img src="https://github.com/user-attachments/assets/7129ce3a-6ddf-4873-b38e-37ffbcf21e07" className="w-5" alt="X"/></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition"><img src="https://github.com/user-attachments/assets/1f72220e-2cd3-4520-abdf-7a707d6d6a5e" className="w-5" alt="Instagram"/></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition"><img src="https://github.com/user-attachments/assets/86065be9-ec6f-4edd-9bc3-3048628a1c25" className="w-5" alt="LinkedIn"/></a>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-6">Quick Links</h3>
          <div className="space-y-4">
            <a href="#home" className="block text-gray-400 hover:text-red-500 transition">Home</a>
            <a href="#features" className="block text-gray-400 hover:text-red-500 transition">Features</a>
            <a href="#ourcars" className="block text-gray-400 hover:text-red-500 transition">Our Fleet</a>
            <a href="#contact" className="block text-gray-400 hover:text-red-500 transition">Contact</a>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-white inline-block pb-2">Our Location</h2>
          <div className="border-2 border-gray-600 rounded-xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467112975!2d79.85890831477284!3d6.914677995003817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25963120b1509%3A0x2db2c18a5281fb71!2sLotus%20Tower!5e0!3m2!1sen!2slk!4v1625555555555!5m2!1sen!2slk" 
              width="100%" 
              height="250" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy">
            </iframe>
          </div>
        </div>
      </div>
      
      <div className="text-center pt-8 border-t border-gray-700 text-gray-400">
        <p>&copy; 2026 Keystone Rentals. All rights reserved.</p>
      </div>
    </footer>
  );
}