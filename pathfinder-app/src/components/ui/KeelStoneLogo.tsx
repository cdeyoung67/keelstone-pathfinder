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
    sm: 'w-15 h-8',  // ~60x32px
    md: 'w-20 h-10', // ~80x40px  
    lg: 'w-30 h-15', // ~120x60px
    xl: 'w-40 h-20'  // ~160x80px
  };

  const sizesMap = {
    sm: '60px',
    md: '80px', 
    lg: '120px',
    xl: '160px'
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
