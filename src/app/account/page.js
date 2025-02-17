'use client'

import { useState, useEffect } from "react";
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

import CouponPreview from "../components/CouponPreview"
import CouponDetail from "../components/CouponDetails"

export default function Page() {
  const [userId, setUserId] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [failed, setFailed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [coupons, setCoupons] = useState(null);
  const { width, height } = useWindowSize();

  // Get the user ID
  useEffect(() => {
    const urlCode = new URLSearchParams(window.location.search).get('code');
    const localCode = localStorage.getItem('code');
    
    if (urlCode) {
      localStorage.setItem('code', urlCode);
      setUserId(urlCode);
    } else if (localCode) {
      setUserId(localCode);
    } else {
      setFailed(true);
    }
  }, []);

  // Fetch user's coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/account`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data?.coupons) {
          throw new Error('Invalid response format');
        }

        setCoupons(data.coupons);
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
        setFailed(true);
      }
    };

    fetchCoupons();
  }, [userId]);

  const premiumCoupons = coupons?.filter(coupon => coupon.premium);
  const standardCoupons = coupons?.filter(coupon => !coupon.premium);

  const handleCouponClick = (coupon) => {
    setSelectedCoupon(coupon);
  };

  const handleValidated = (id) => {
    setSelectedCoupon(null);
    setCoupons(coupons.map(coupon => {
      if (coupon._id === id) {
        return {
          ...coupon,
          used: true,
        }
      }
      return coupon;
    }));

    setShowConfetti(true);
  };

  const handleCloseClick = () => {
    setSelectedCoupon(null);
  }

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  if (!coupons && !failed) {
    return (
      <div className="flex flex-col items-center gap-3 animate-pulse pt-6">
        <div className="rounded-lg bg-slate-700 h-10 w-72 opacity-10"></div>
        <div className="rounded-lg bg-slate-700 h-4 w-full opacity-10"></div>
        <div className="rounded-lg bg-slate-700 h-4 w-full opacity-10"></div>
        <div className="rounded-lg bg-slate-700 h-14 w-full opacity-10 mt-8"></div>
        <div className="rounded-lg bg-slate-700 h-14 w-full opacity-10"></div>
        <div className="rounded-lg bg-slate-700 h-14 w-full opacity-10"></div>
        <div className="rounded-lg bg-slate-700 h-14 w-full opacity-10"></div>
      </div>
    )
  }

  if (failed) {
    return (
      <div className="flex flex-col items-center gap-1 pt-6">
        <h1 className="text-white text-2xl font-black text-center leading-none mb-1.5">We couldn&apos;t find your coupons</h1>
        <p className="text-sm leading-tight max-w-72 text-center text-white">Use the link in the email we sent you.</p>
      </div>
    )
  }

  return (
    <main className="pb-20">
      <div className="text-center text-white mt-2 flex flex-col items-center mb-4">
        <h1 className="text-white text-3xl font-black text-center leading-none mb-1.5">Your Coupons</h1>
        <p className="text-sm leading-tight max-w-72">Select a partner, walk up to their booth and give them your promo code</p>
      </div>

      {premiumCoupons.length > 0 && (
        <div className="mb-5">
          <h2 className="text-white text-base font-bold mb-1 text-center">Premium Partners</h2>
          <div className="flex flex-col gap-1.5">
            {premiumCoupons.map((coupon) => (
              <CouponPreview coupon={coupon} key={coupon._id} handleClick={() => handleCouponClick(coupon)} />
            ))}
          </div>
        </div>
      )}

      {standardCoupons.length > 0 && (
        <div className="mb-5">
          <h2 className="text-white text-base font-bold mb-1 text-center">Official Partners</h2>
          <div className="flex flex-col gap-1.5">
            {standardCoupons.map((coupon) => (
              <CouponPreview coupon={coupon} key={coupon._id} handleClick={() => handleCouponClick(coupon)} />
            ))}
          </div>
        </div>
      )}

      <CouponDetail 
        coupon={selectedCoupon} 
        onValidated={handleValidated}
        handleCloseClick={handleCloseClick}
      />

      {showConfetti &&
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={1000}
          onConfettiComplete={handleConfettiComplete}
          className="!z-50"
        />
      }
    </main>
  )
}