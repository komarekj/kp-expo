'use client'

import Image from 'next/image'

import IconArrow from './IconArrow';
import IconCheck from './IconCheck';

export default function CouponPreview({ coupon, handleClick }) {
  const { partner, info, discount, logo, used } = coupon;

  return (
    <button
      className={`bg-white shadow-sm rounded-xl py-4 px-3 flex items-center gap-3 transition-all duration-300 ease-in-out ${used ? 'opacity-80 pointer-events-none' : ''}`}
      onClick={() => handleClick(coupon)}
    >
      <Image
        src={logo}
        width={70}
        height={50}
        alt={partner}
        className='h-10 object-contain'
      />
      <span className="flex flex-col grow">
        <h2 className="text-sm text-left font-bold leading-tight">{partner}</h2>
        <span className="text-xs text-left leading-tight">{info}</span>
      </span>
      {!used && (
        <>
          <span className="border border-dashed border-black uppercase text-sm font-bold leading-none px-2 py-1 w-20 flex justify-center">
            {discount} OFF
          </span>
          <span className="text-gray-300">
            <IconArrow />
          </span>
        </>
      )}
      {used && (
        <span className="text-black">
          <IconCheck />
        </span>
      )}
      
    </button>
  );
}