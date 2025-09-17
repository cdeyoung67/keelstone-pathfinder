import Image from 'next/image';

interface KeelStoneLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function KeelStoneLogo({ 
  size = 'md', 
  className = ''
}: KeelStoneLogoProps) {
  const sizeClasses = {
    sm: { width: 60, height: 30 },
    md: { width: 80, height: 40 },
    lg: { width: 120, height: 60 },
    xl: { width: 160, height: 80 }
  };

  const dimensions = sizeClasses[size];

  return (
    <div className={className}>
      <Image
        src="/keel-stone-logo.png"
        alt="Keel Stone"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
        priority
      />
    </div>
  );
}
