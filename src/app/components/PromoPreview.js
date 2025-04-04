'use client'

import Image from 'next/image'

import IconArrow from './IconArrow';
import IconCheck from './IconCheck';

export default function CouponPreview({ coupon }) {
  const { partner, info, discount, logo, used, gift } = coupon;

  return (
    <div
      className={`bg-white shadow-sm rounded-xl py-4 px-3 flex items-center gap-3 transition-all duration-300 ease-in-out ${used ? 'opacity-80 pointer-events-none' : ''}`}
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
    </div>
  );
}