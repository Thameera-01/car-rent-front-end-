'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
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

type BookingRecord = Record<string, string | number | boolean | null | undefined>;

export default function AdminPage() {
  const [status, setStatus] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isCarsLoading, setIsCarsLoading] = useState(true);
  const [isBookingsLoading, setIsBookingsLoading] = useState(true);

  // Search States
  const [carSearch, setCarSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');

  const fetchCars = async () => {
    setIsCarsLoading(true);
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsCarsLoading(false);
    }
  };

  const fetchBookings = async () => {
    setIsBookingsLoading(true);
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchBookings();
  }, []);

  // කාර් එකක් මැකීම (Delete)
  const handleDeleteCar = async (id: number) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      const res = await fetch(`/api/cars?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCars();
      } else {
        alert('Failed to delete car');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Booking එකක් මැකීම (Delete)
  const handleDeleteBooking = async (id: any) => {
    if (!confirm('Are you sure you want to delete this booking request?')) return;
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBookings();
      } else {
        alert('Failed to delete booking');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Adding car...');
    
    const formData = new FormData(e.currentTarget);
    const newCar = {
      name: formData.get('name'),
      category: formData.get('category'),
      type: formData.get('type'),
      image: formData.get('image'),
      seats: Number(formData.get('seats')),
      transmission: formData.get('transmission'),
      ac: formData.get('ac'),
      price: formData.get('price'),
      badge: formData.get('badge')
    };

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar),
      });

      if (response.ok) {
        setStatus('Car added successfully! 🎉');
        e.currentTarget.reset();
        fetchCars();
        setTimeout(() => setStatus(''), 4000);
      } else {
        setStatus('Failed to add car. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setStatus('An error occurred.');
    }
  };
const router = useRouter(); // <-- අලුතින් එකතු කරන්න

  // Logout Function එක
  const handleLogout = async () => {
    if (!confirm('Are you sure you want to log out?')) return;
    const res = await fetch('/api/auth/logout');
    if (res.ok) {
      router.push('/login');
      router.refresh();
    }
  };
  // Filtered Lists for Search
  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(carSearch.toLowerCase()) || 
    car.category.toLowerCase().includes(carSearch.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => 
    String(b.customer_name ?? '').toLowerCase().includes(bookingSearch.toLowerCase()) || 
    String(b.email ?? '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
    String(b.car_name ?? '').toLowerCase().includes(bookingSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black px-6 py-8 text-white font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header & Stats */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Advanced Admin Dashboard</h1>
              <p className="text-sm text-zinc-400 mt-1">Complete system management: Inventory control & Client bookings tracking.</p>
            </div>
            <div className="flex gap-3 text-sm font-semibold">
              <button onClick={() => { fetchCars(); fetchBookings(); }} className="rounded-xl bg-red-700 hover:bg-red-600 px-5 py-2.5 text-white transition shadow-lg">
                 Refresh System
              </button>
              <button onClick={handleLogout} className="rounded-xl border border-red-500/30 bg-zinc-900 hover:bg-red-900/40 px-5 py-2.5 text-red-400 transition shadow-lg">
                 Logout
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Total Cars</div>
              <div className="mt-1 text-3xl font-extrabold text-white">{cars.length}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Total Bookings</div>
              <div className="mt-1 text-3xl font-extrabold text-white">{bookings.length}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 col-span-2 md:col-span-1">
              <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Database Link</div>
              <div className="mt-1 text-lg font-bold text-green-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span> Connected
              </div>
            </div>
          </div>
        </div>

        {/* Add Car & Inventory Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Add Car Form */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
            <h2 className="mb-6 inline-block border-b-2 border-red-600 pb-2 text-2xl font-bold text-white">Add New Car</h2>

            <form onSubmit={handleAddCar} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-bold text-gray-300 text-xs">Car Name</label>
                  <input type="text" name="name" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-red-500 text-sm" placeholder="e.g. Audi A4" />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-gray-300 text-xs">Category</label>
                  <select name="category" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-red-500 text-sm">
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="luxury">Luxury</option>
                    <option value="economy">Economy</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-bold text-gray-300 text-xs">Car Type</label>
                  <input type="text" name="type" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-red-500 text-sm" placeholder="e.g. LUXURY SEDAN" />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-gray-300 text-xs">Price Per Day (RS)</label>
                  <input type="number" name="price" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-red-500 text-sm" placeholder="e.g. 12000" />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-gray-300 text-xs">Seats</label>
                  <input type="number" name="seats" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-red-500 text-sm" placeholder="e.g. 5" />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-gray-300 text-xs">Transmission</label>
                  <select name="transmission" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-red-500 text-sm">
                    <option value="Auto">Auto</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-bold text-gray-300 text-xs">A/C</label>
                  <select name="ac" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-red-500 text-sm">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-bold text-gray-300 text-xs">Badge</label>
                  <input type="text" name="badge" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-red-500 text-sm" placeholder="e.g. New" />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-bold text-gray-300 text-xs">Image Path/URL</label>
                <input type="text" name="image" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-red-500 text-sm" placeholder="e.g. /images/car1.jpg" />
              </div>

              <button type="submit" className="mt-4 w-full rounded-xl bg-red-700 py-3.5 font-bold text-white transition hover:bg-red-800 shadow-lg">
                Add Car to Database
              </button>
            </form>
            {status && <p className="mt-4 text-center font-bold text-green-400">{status}</p>}
          </section>

          {/* Available Cars List with Search & Delete */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Available Cars</h2>
                <p className="text-xs text-zinc-500 mt-1">Cars currently stored in the database</p>
              </div>
              <input 
                type="text" 
                placeholder="Search available cars..." 
                value={carSearch}
                onChange={(e) => setCarSearch(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-red-500"
              />
            </div>
            
            <div className="overflow-auto rounded-xl border border-zinc-800 flex-1 max-h-[500px]">
              <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
                <thead className="bg-zinc-950 text-zinc-300 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Car</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Price/Day</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                  {isCarsLoading ? (
                    <tr><td className="px-4 py-6 text-center text-zinc-400" colSpan={4}>Loading cars...</td></tr>
                  ) : filteredCars.length > 0 ? (
                    filteredCars.map((car) => (
                      <tr key={car.id} className="hover:bg-zinc-950/60">
                        <td className="px-4 py-2">
                          <img src={car.image} alt={car.name} className="w-14 h-9 object-cover rounded border border-zinc-700" />
                        </td>
                        <td className="px-4 py-2 font-semibold text-white">
                          <div>{car.name}</div>
                          <div className="text-xs uppercase text-zinc-500">{car.category}</div>
                        </td>
                        <td className="px-4 py-2 text-red-400 font-bold">RS. {car.price}</td>
                        <td className="px-4 py-2 text-right">
                          <button 
                            onClick={() => handleDeleteCar(car.id)}
                            className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition border border-red-500/20"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td className="px-4 py-6 text-center text-zinc-400" colSpan={4}>No available cars found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* Customer Booking Requests with Search & Delete */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Customer Booking Requests</h2>
            <input 
              type="text" 
              placeholder="Search bookings by name/email..." 
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-red-500 md:w-80"
            />
          </div>

          <div className="overflow-auto rounded-xl border border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
              <thead className="bg-zinc-950 text-zinc-300">
                <tr>
                  <th className="px-4 py-3">Customer Name</th>
                  <th className="px-4 py-3">Car Requested</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Rental Dates</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                {isBookingsLoading ? (
                  <tr><td className="px-4 py-6 text-center text-zinc-400" colSpan={6}>Loading bookings...</td></tr>
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, idx) => (
                    <tr key={String(booking.id ?? idx)} className="hover:bg-zinc-950/60 align-middle">
                      <td className="px-4 py-3 font-semibold text-white">{String(booking.customer_name ?? 'N/A')}</td>
                      <td className="px-4 py-3 text-red-400 font-bold">{String(booking.car_name ?? 'General Inquiry')}</td>
                      <td className="px-4 py-3 text-zinc-300 text-xs">
                        <div>{String(booking.email ?? '')}</div>
                        <div className="text-zinc-400">{String(booking.phone ?? '')}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300 text-xs">
                        <div>From: {String(booking.start_date ?? 'N/A')}</div>
                        <div>To: {String(booking.end_date ?? 'N/A')}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300 italic text-xs max-w-xs truncate">{String(booking.message ?? '-')}</td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition border border-red-500/20"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="px-4 py-6 text-center text-zinc-400" colSpan={6}>No bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}