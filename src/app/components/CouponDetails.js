'use client'

import Image from 'next/image'
import { useRef, useEffect, useState } from 'react';
import RotateLoader from "react-spinners/ClipLoader";

import IconClose from './IconClose';
import IconCheck from './IconCheck';
import IconMap from './IconMap';

const PIN = '2025';

export default function CouponDetail({ coupon, onValidated, handleCloseClick }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dialogRef = useRef(null);
  const pinInputRef = useRef(null);

  const handleValidateClick = () => {
    setConfirmOpen(true);
  };

  const handleValidateCancel = () => {
    setConfirmOpen(false);
    setError(null);
  };

  const handleValidateConfirm = () => {
    setLoading(true);

    const pin = pinInputRef.current.value;

    if (pin !== PIN) {
      setError('Invalid PIN. Please try again.');
      setLoading(false);
      return;
    }
    
    const validateCoupon = async () => {
      try {
        const response = await fetch(`/api/validate-coupon`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: coupon._id }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to validate coupon. Please try again.');
        }

        onValidated(coupon._id);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    validateCoupon();
  }

  useEffect(() => {
    const handleDialogClick = (e) => {
      // Check if the click was on the dialog backdrop
      if (e.target === dialogRef.current) {
        handleCloseClick();
      }
    };

    const dialog = dialogRef.current
    if (!dialog) return

    if (coupon) {
      dialog.showModal()
      dialog.addEventListener('click', handleDialogClick);
    } else {
      setLoading(false);
      setConfirmOpen(false);
      setError(null);
      dialog.close()
    }

    // Cleanup event listener
    return () => {
      if (dialog) {
        dialog.removeEventListener('click', handleDialogClick);
      }
    };
  }, [coupon, handleCloseClick]);
  
  // Effect to focus on PIN input when it becomes visible
  useEffect(() => {
    if (confirmOpen && pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [confirmOpen]);

  return (
    <dialog 
      className="bg-white fixed bottom-0 left-0 right-0 top-auto p-4 m-0 w-full max-w-none transition-all duration-300 ease-in-out"
      ref={dialogRef}
    >
      <div className="flex flex-col items-center text-center">
        {coupon?.logo && <Image
          src={coupon?.logo}
          width={140}
          height={100}
          alt={coupon?.partner}
          className="h-20 object-contain mb-2"
        />}

        <p className="text-lg font-bold">{coupon?.partner}</p>
        <p className="text-sm mb-8 leading-tight">{coupon?.info}</p>

        <p className="text-sm mb-8 leading-tight flex items-center gap-1">
          <IconMap className="w-4 h-auto text-gray-300" />
          <span className="font-bold">Location:</span> {coupon?.instructions}
        </p>

        <p className="text-sm font-bold mb-1">Your {coupon?.gift ? '' : `${coupon?.discount} OFF `}Coupon:</p>
        <span className="mb-8 border border-dashed border-black uppercase text-3xl font-bold leading-none px-2 py-6 w-full text-center tracking-widest">
          {coupon?.code}
        </span>

        {!loading && (
          <div className="flex flex-col">
            {!confirmOpen && (
              <button className="underline text-sm text-gray-500 focus:outline-none" onClick={handleValidateClick}>
                Validate Coupon
              </button>
            )}

            {confirmOpen && (
              <div class="flex gap-1">
                <input 
                  type="tel" 
                  className="border border-gray-300 rounded-md p-2 w-36 text-center focus:outline-none" 
                  placeholder="Enter PIN"
                  ref={pinInputRef}
                />
                <button className="bg-orange text-white rounded-md flex items-center justify-center w-12 h-12" onClick={handleValidateConfirm}>
                  <span className="sr-only">Confirm</span>
                  <IconCheck />
                </button>
                <button className="bg-gray-100 text-gray-400 rounded-md flex items-center justify-center w-12 h-12" onClick={handleValidateCancel}>
                  <span className="sr-only">Close</span>
                  <IconClose />
                </button>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-500 mt-2">{error}</div>
            )}
          </div>
        )}

        {loading && (
          <RotateLoader color="#ff8a00" />
        )}

        <button className="bg-orange text-white rounded-full flex items-center justify-center w-12 h-12 absolute top-2 right-2 focus:outline-none" onClick={handleCloseClick}>
          <span className="sr-only">Close</span>
          <IconClose />
        </button>
        
      </div>
    </dialog>
  );
}