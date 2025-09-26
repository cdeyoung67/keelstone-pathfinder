import Image from 'next/image';

interface KeelStoneLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

export default function KeelStoneLogo({ 
  size = 'md', 
  className = '',
  priority = false
}: KeelStoneLogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-8',  // ~64x32px
    md: 'w-20 h-10', // ~80x40px  
    lg: 'w-28 h-14', // ~112x56px
    xl: 'w-36 h-18'  // ~144x72px
  };

  const sizesMap = {
    sm: '64px',
    md: '80px', 
    lg: '112px',
    xl: '144px'
  };

  const containerClass = sizeClasses[size];
  const sizes = sizesMap[size];

  return (
    <div className={`relative ${containerClass} ${className}`}>
      <Image
        src="/keel-stone-logo.png"
        alt="Keel Stone"
        fill
        sizes={sizes}
        className="object-contain"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
}
