import { CardinalVirtue } from '@/lib/types-personal';
import { Badge } from '@/components/ui/badge';
import { 
  LightBulbIcon, 
  ShieldCheckIcon, 
  ScaleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

interface VirtueTagProps {
  virtue: CardinalVirtue;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const virtueConfig: Record<CardinalVirtue, { label: string; icon: any; color: string; description: string }> = {
  wisdom: {
    label: 'Wisdom',
    icon: LightBulbIcon,
    color: 'bg-gold-100 text-gold-800 border-gold-200 hover:bg-gold-200',
    description: 'Seeing clearly and understanding deeply'
  },
  courage: {
    label: 'Courage',
    icon: ShieldCheckIcon,
    color: 'bg-olive-100 text-olive-800 border-olive-200 hover:bg-olive-200',
    description: 'Acting rightly despite fear or difficulty'
  },
  justice: {
    label: 'Justice',
    icon: ScaleIcon,
    color: 'bg-navy-100 text-navy-800 border-navy-200 hover:bg-navy-200',
    description: 'Giving each person their due with fairness'
  },
  temperance: {
    label: 'Temperance',
    icon: ClockIcon,
    color: 'bg-sand-200 text-sand-800 border-sand-300 hover:bg-sand-300',
    description: 'Moderation and self-control in all things'
  }
};

export default function VirtueTag({ 
  virtue, 
  size = 'md', 
  showIcon = true, 
  className = '' 
}: VirtueTagProps) {
  const config = virtueConfig[virtue];
  
  // Safety check - return null if config is not found
  if (!config) {
    console.warn(`VirtueTag: No configuration found for virtue "${virtue}"`);
    return null;
  }
  
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <Badge 
      variant="secondary"
      className={`
        ${config.color}
        ${sizeClasses[size]}
        inline-flex items-center gap-1.5
        font-medium
        transition-colors duration-200
        border
        ${className}
      `}
      title={config.description}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  );
}
