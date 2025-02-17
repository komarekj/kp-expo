'use client'
import {useState, useEffect} from 'react';
import {Elements, CardNumberElement, CardElement, PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import IconCheck from './components/IconCheck';
import IconMembership from './components/IconMembership';
import IconDoubleArrow from './components/IconDoubleArrow';

const stripePromise = loadStripe('pk_test_5HeOS2ywIXQnlFV8yKxSe6ZJ');

export default function Home() {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1000 }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const options = {
    clientSecret,
    externalPaymentMethodTypes: [],
    fields: {
      billingDetails: {
        address: {
          country: 'never',
          postalCode: 'never'
        }
      }
    },
  };

  const foptions = {
    fields: {
      address: {
        mode: 'billing',
        fields: {
          country: 'hidden',
          postalCode: 'hidden'
        }
      }
    }
  };

  if (!clientSecret) return <div>Loading...</div>;

  return (
    <main className="flex flex-col items-center">
      <div className="bg-gray-800 text-white text-sm text-center py-1.5 px-4 rounded-full mb-2">
        Best Deal At The Expo
      </div>
      <h1 className="text-white text-3xl font-black text-center leading-none mb-4">Join Our Membership <br />& Save Up To $885</h1>
      <ul className="text-white text-base mb-5 leading-tight space-y-1">
        <li className='flex items-center gap-2'>
          <IconCheck /> 
          Instant $85 saving in coupons
        </li>
        <li className='flex items-center gap-2'>
          <IconCheck /> 
          Save with 5 Brands At the Expo
        </li>
        <li className='flex items-center gap-2'>
          <IconCheck /> 
          Exclusive deals & perks for a year
        </li>
      </ul>
      <div className="w-full py-4 px-3 bg-white rounded-xl gap-2 text-left">
        <div className="flex gap-2 items-center border-b border-gray-200 border-b-style-dashed pb-5 mb-5">
          <IconMembership />
          <h2 className="text-base font-bold leading-none grow">Gold Membership</h2>
          <div className="flex gap-1 text-sm">
            <span className="opacity-40">Save $85!</span>
            <span className="font-bold">$10/year</span>
          </div>
        </div>
        <Elements stripe={stripePromise} options={options}>
          <form>
            <PaymentElement options={foptions}/>
            {/* <CardElement /> */}
            <button className="relative rounded-lg w-full bg-green mt-5 text-white p-4 font-bold">
              <span>Get Your Coupons Now</span>
              <IconDoubleArrow className="absolute right-4 top-1/2 -translate-y-1/2" />
            </button>
            <p className="text-xs text-center mt-2.5 text-gray-600">Limited Time Offer. Don’t miss out!</p>
          </form>
        </Elements>
      </div>
    </main>
  );
}
