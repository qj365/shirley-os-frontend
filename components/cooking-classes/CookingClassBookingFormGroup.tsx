'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { GetCookingClassBySlugResponse } from '@/src/lib/api/customer';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

const registerClassSchema = z.object({
  numberOfPeople: z.string().min(1, 'This field is required'),
  fullName: z.string().trim().min(1, 'This field is required'),
  email: z.string().min(1, 'This field is required').email('Email invalid'),
  phone: z.string().trim().min(1, 'This field is required'),
  bookingFor: z.string().min(1, 'This field is required'),
  specialRequest: z.string().min(1, 'This field is required'),
  holderName: z.string().trim().min(1, 'This field is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card Number invalid'),
  expire: z.string().regex(/^\d{2}\/\d{2}$/, 'Expire date invalid'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV invalid'),
  region: z.string().min(1, 'This field is required'),
  voucherCode: z.string(),
});

type RegisterClassFormValues = z.infer<typeof registerClassSchema>;

interface CookingClassBookingFormGroupProps {
  cookingClass: GetCookingClassBySlugResponse;
}

export default function CookingClassBookingFormGroup({
  cookingClass,
}: CookingClassBookingFormGroupProps) {
  const [step, setStep] = useState(1);
  const form = useForm<RegisterClassFormValues>({
    resolver: zodResolver(
      registerClassSchema
    ) as unknown as Resolver<RegisterClassFormValues>,
  });

  console.log(cookingClass, 'cookingClass');

  const renderSection = useMemo(() => {
    const steps = [
      {
        key: 1,
        name: 'Details',
        icon: (
          <Image
            width={28}
            height={28}
            className="!h-7 !w-7 object-contain"
            alt="step icon"
            src="/svg/user.svg"
          />
        ),
      },
      {
        key: 2,
        name: 'Payment',
        icon: (
          <Image
            width={28}
            height={28}
            alt="step icon"
            src="/svg/credit-card.svg"
          />
        ),
      },
      {
        key: 3,
        name: 'Confirmation',
        icon: (
          <Image
            width={28}
            height={28}
            alt="step icon"
            src="/svg/checkmark-done.svg"
          />
        ),
      },
    ];

    return (
      <div className="my-[50px] flex md:my-[125px]">
        {steps.map((item, index) => {
          return (
            <div
              key={item.key}
              className={cn(
                'flex-start relative flex items-center',
                index < steps?.length - 1 && 'flex-1'
              )}
            >
              <div
                className={cn(
                  'h-4 !min-h-4 w-4 !min-w-4 rounded-full border-[2px] border-solid border-[#aeaeae]',
                  item.key <= step && 'opacity-0'
                )}
              />
              <span
                className={cn(
                  'absolute bottom-0 left-0 translate-y-[130%] text-sm font-bold text-[#AEAEAE] md:text-lg',
                  item.key === 1 && '-translate-x-[8px]',
                  item.key === 2 && '-translate-x-1/3',
                  item.key === 3 && '-translate-x-2/3'
                )}
              >
                {item.name}
              </span>

              {item.key <= step && (
                <div
                  className={cn(
                    'absolute top-0 left-0 !h-7 !w-7 -translate-y-1/4 bg-white',
                    item.key > 1 && '-translate-x-1/4'
                  )}
                >
                  {item.icon}
                </div>
              )}

              {index < steps.length - 1 && (
                <div className="h-0.5 !min-h-0.5 flex-1 bg-[#aeaeae]" />
              )}
            </div>
          );
        })}
      </div>
    );
  }, [step]);

  return (
    <div className="mx-auto mb-10 max-w-[1138px] px-6 md:mb-20">
      {renderSection}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {
            console.log('asdasd');
          })}
        >
          {step === 1 && (
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="numberOfPeople"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      I would like to book for
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="sh-text-input min-h-11 outline-none focus:ring-0">
                          <SelectValue placeholder="Select number of people" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-none bg-white">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          num => (
                            <SelectItem
                              key={num}
                              value={num.toString()}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              {num} {num === 1 ? 'person' : 'people'}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Full name</FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="Enter Full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="Enter Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Phone no</FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="Enter Phone no"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookingFor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Booking for</FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="Enter Booking for"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Any dietary requirements or allergies?
                    </FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="Enter special request"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="holderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Card holder name
                    </FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="Enter card holder name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Card number</FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="Enter Card number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Expire date</FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="MM/YY"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">CVV</FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="Enter cvv"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Region</FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="Enter region"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voucherCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Voucher Code</FormLabel>
                    <FormControl>
                      <input
                        className="sh-text-input"
                        placeholder="Enter Voucher Code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <p className="text-xl font-bold">Note</p>
                <p className="text-justify text-base font-medium">
                  Registration opens 15 minutes before the class starts. Dietary
                  requirements can be catered for but only if known in advance.
                  If you have a Virgin experience days voucher, please contact
                  us and we can place your booking. In our cooking class, we use
                  induction hobs. If you have a pacemaker fitted, please get in
                  touch with us. Please familiarize yourself with our
                  cancellation policy prior to booking. 
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-10 md:gap-15">
              <h3 className="text-center text-lg font-bold md:text-3xl">
                🎉 Your Cooking Class Booking is <br /> Confirmed!
              </h3>

              <p className="text-center text-sm md:text-xl">
                Dear Ibrahim Shorey,
                <br />
                Thank you for booking your cooking class with us! 🎊 <br />{' '}
                We’re excited to have you join us for a fun and delicious
                experience.
              </p>
              <div className="mx-auto flex items-start gap-3">
                <Checkbox id="cookingClassBookingGetNews" />
                <Label htmlFor="cookingClassBookingGetNews">
                  I am happy for Shirley’s to send me exclusive information and
                  deals, from time to time.
                </Label>
              </div>
            </div>
          )}

          {step < 3 && (
            <Button
              className="btn-gradient--yellow mx-auto mt-7.5 flex w-[220px] text-lg font-semibold hover:opacity-80 md:w-[565px]"
              type="button"
              onClick={() => setStep(prev => (prev === 3 ? 1 : prev + 1))}
            >
              {step === 1 ? 'Next' : 'Submit'}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
