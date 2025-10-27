'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { api } from '@/src/lib/api/customer';
import { GetBookedCookingClassResponse } from '@/src/lib/api/customer/client';
import formatDisplayCurrency from '@/utils/helpers/formatDisplayCurrency';
import { Calendar, MapPin, Users, UtensilsCrossed, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface CookingClassFilters {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export default function MyCookingClasses() {
  const [bookings, setBookings] = useState<GetBookedCookingClassResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current month's start and end dates
  const getCurrentMonthDates = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startOfMonth, endOfMonth };
  };

  const [filters, setFilters] = useState<CookingClassFilters>(() => {
    const { startOfMonth, endOfMonth } = getCurrentMonthDates();
    return {
      startDate: startOfMonth,
      endDate: endOfMonth,
    };
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<GetBookedCookingClassResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookedClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        startDate: filters.startDate!.toISOString(),
        endDate: filters.endDate!.toISOString(),
      };

      const response =
        await api.cookingClass.customerGetBookedCookingClass(params);

      setBookings(response);
    } catch (err) {
      setError('Failed to fetch cooking classes. Please try again.');
      console.error('Error fetching cooking classes:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchBookedClasses();
  }, [fetchBookedClasses]);

  const handleFilterChange = (
    key: keyof CookingClassFilters,
    value: Date | undefined
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const { startOfMonth, endOfMonth } = getCurrentMonthDates();
    setFilters({
      startDate: startOfMonth,
      endDate: endOfMonth,
    });
  };

  const handleBookingClick = (booking: GetBookedCookingClassResponse) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'bg-[#22C55E] hover:bg-[#16A34A] text-white';
      case 'PENDING':
        return 'bg-[#F3C03F] hover:bg-[#E5B338] text-black';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-[#DC2626] hover:bg-[#B91C1C] text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const getPaymentStatusDisplay = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'PAID';
      case 'PENDING':
        return 'PENDING';
      case 'FAILED':
        return 'FAILED';
      case 'CANCELLED':
        return 'CANCELLED';
      default:
        return status || 'UNKNOWN';
    }
  };

  return (
    <DashboardLayout activePage="/my-page/cooking-classes">
      <h1 className="mt-4 mb-6 text-xl font-bold text-black md:text-3xl lg:mb-8">
        My Cooking Classes
      </h1>

      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2 border-none bg-[#F3C03F] hover:bg-[#E5B338]"
          >
            <Calendar className="h-4 w-4" />
            Date Filters
          </Button>
        </div>

        {showFilters && (
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <DatePicker
                  value={filters.startDate}
                  onChange={date => handleFilterChange('startDate', date)}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <DatePicker
                  value={filters.endDate}
                  onChange={date => handleFilterChange('endDate', date)}
                  placeholder="Select end date"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={fetchBookedClasses}
                className="bg-[#F3C03F] hover:bg-[#E5B338]"
              >
                Apply Filters
              </Button>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="bg-black text-white hover:opacity-80"
              >
                Reset to Current Month
              </Button>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#F3C03F]"></div>
            <p className="mt-4 text-gray-600">Loading cooking classes...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
          <Button
            onClick={fetchBookedClasses}
            variant="outline"
            size="sm"
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-3">
            {bookings.map(booking => (
              <div
                key={booking.id}
                onClick={() => handleBookingClick(booking)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#F3C03F] hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black">
                      {booking.cookingClass.name}
                    </h3>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600 md:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#F3C03F]" />
                        <span>
                          {new Date(
                            booking.schedule.dateTime
                          ).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span>
                          {new Date(
                            booking.schedule.dateTime
                          ).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#F3C03F]" />
                        <span>{booking.numberOfPeople} people</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm text-gray-500">
                      {' '}
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusStyle(booking.paymentStatus)}`}
                      >
                        {getPaymentStatusDisplay(booking.paymentStatus)}
                      </span>
                    </p>
                    <p className="text-lg font-bold text-black">
                      {formatDisplayCurrency(
                        booking.cookingClass.price * booking.numberOfPeople
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {bookings.length === 0 && (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
              <div className="text-center">
                <UtensilsCrossed className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-700">
                  No cooking classes found
                </h3>
                <p className="mt-2 text-gray-500">
                  {filters.startDate || filters.endDate
                    ? 'Try adjusting your date filters'
                    : 'Your booked cooking classes will appear here'}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-black">
                {selectedBooking.cookingClass.name}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="h-8 w-8 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left Column - Class Info */}
                <div className="space-y-6">
                  {/* Class Image */}
                  <div className="relative z-0 h-64 w-full overflow-hidden rounded-lg">
                    <Image
                      src={selectedBooking.cookingClass.image}
                      alt={selectedBooking.cookingClass.name}
                      fill
                      className="object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/image/placeholder.png';
                      }}
                    />
                  </div>

                  {/* Class Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        Description
                      </h3>
                      <p className="mt-1 text-gray-600">
                        {selectedBooking.cookingClass.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700">
                          Duration
                        </h4>
                        <p className="text-gray-600">
                          {selectedBooking.cookingClass.duration} minutes
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">
                          Price per person
                        </h4>
                        <p className="text-gray-600">
                          £{selectedBooking.cookingClass.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700">Location</h4>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F3C03F]" />
                        <span className="text-gray-600">
                          {selectedBooking.cookingClass.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Booking Info */}
                <div className="space-y-6">
                  {/* Payment Status */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Payment Status
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusStyle(selectedBooking.paymentStatus)}`}
                      >
                        {getPaymentStatusDisplay(selectedBooking.paymentStatus)}
                      </span>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Schedule
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-[#F3C03F]" />
                        <div>
                          <p className="font-medium text-gray-700">Date</p>
                          <p className="text-gray-600">
                            {new Date(
                              selectedBooking.schedule.dateTime
                            ).toLocaleDateString(undefined, {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}{' '}
                            {new Date(
                              selectedBooking.schedule.dateTime
                            ).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-[#F3C03F]" />
                        <div>
                          <p className="font-medium text-gray-700">Attendees</p>
                          <p className="text-gray-600">
                            {selectedBooking.numberOfPeople} people
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Booking Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-gray-700">Booked by</p>
                        <p className="text-gray-600">
                          {selectedBooking.fullname}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Email</p>
                        <p className="text-gray-600">{selectedBooking.email}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Phone</p>
                        <p className="text-gray-600">{selectedBooking.phone}</p>
                      </div>
                      {selectedBooking.bookingFor && (
                        <div>
                          <p className="font-medium text-gray-700">
                            Booking for
                          </p>
                          <p className="text-gray-600">
                            {selectedBooking.bookingFor}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-700">Booked on</p>
                        <p className="text-gray-600">
                          {new Date(
                            selectedBooking.createdAt
                          ).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Special Request */}
                  {selectedBooking.specialRequest && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Special Request
                      </h3>
                      <div className="rounded-lg bg-yellow-50 p-4">
                        <p className="text-gray-700">
                          {selectedBooking.specialRequest}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Total Cost */}
                  <div className="rounded-lg bg-[#F3C03F]/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-700">
                          Total Cost
                        </p>
                        <p className="text-sm text-gray-600">
                          £{selectedBooking.cookingClass.price.toFixed(2)} ×{' '}
                          {selectedBooking.numberOfPeople} people
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-black">
                        £
                        {(
                          selectedBooking.cookingClass.price *
                          selectedBooking.numberOfPeople
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
