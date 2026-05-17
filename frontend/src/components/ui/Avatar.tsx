import React from 'react';

interface AvatarProps {
  pic?: string | null;
  init: string;
  size?: number;
  gold?: boolean;
}

export default function Avatar({ pic, init, size = 30, gold = false }: AvatarProps) {
  const colorClasses = gold 
    ? 'bg-ustpGold text-ustpDarkBlue' 
    : 'bg-blue-100 text-ustpBlue';

  return (
    <div 
      className={`rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden ${colorClasses}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {pic ? (
        <img src={pic} alt="User Avatar" className="w-full h-full object-cover" />
      ) : (
        init
      )}
    </div>
  );
}