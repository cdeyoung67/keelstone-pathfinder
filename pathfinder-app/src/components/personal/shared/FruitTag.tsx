import { FruitOfTheSpirit, WisdomTag } from '@/lib/types-personal';
import { Badge } from '@/components/ui/badge';
import { 
  HeartIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  BookOpenIcon,
  EyeIcon,
  ArrowPathIcon,
  TrophyIcon,
  AcademicCapIcon,
  HandRaisedIcon,
  BeakerIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

interface FruitTagProps {
  tag: FruitOfTheSpirit | WisdomTag;
  type: 'fruit' | 'wisdom';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const fruitConfig: Record<FruitOfTheSpirit, { label: string; icon: any; color: string }> = {
  love: {
    label: 'Love',
    icon: HeartIcon,
    color: 'bg-pink-100 text-pink-800 border-pink-200'
  },
  joy: {
    label: 'Joy',
    icon: SparklesIcon,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  peace: {
    label: 'Peace',
    icon: ScaleIcon,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  patience: {
    label: 'Patience',
    icon: ClockIcon,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  kindness: {
    label: 'Kindness',
    icon: HandRaisedIcon,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  goodness: {
    label: 'Goodness',
    icon: CheckCircleIcon,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  faithfulness: {
    label: 'Faithfulness',
    icon: ShieldCheckIcon,
    color: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  gentleness: {
    label: 'Gentleness',
    icon: BeakerIcon,
    color: 'bg-lime-100 text-lime-800 border-lime-200'
  },
  'self-control': {
    label: 'Self-Control',
    icon: LockClosedIcon,
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  }
};

const wisdomConfig: Record<WisdomTag, { label: string; icon: any; color: string }> = {
  stoicism: {
    label: 'Stoicism',
    icon: BookOpenIcon,
    color: 'bg-stone-100 text-stone-800 border-stone-200'
  },
  mindfulness: {
    label: 'Mindfulness',
    icon: EyeIcon,
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  resilience: {
    label: 'Resilience',
    icon: ArrowPathIcon,
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  growth: {
    label: 'Growth',
    icon: TrophyIcon,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  purpose: {
    label: 'Purpose',
    icon: BookOpenIcon,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  gratitude: {
    label: 'Gratitude',
    icon: HeartIcon,
    color: 'bg-pink-100 text-pink-800 border-pink-200'
  },
  compassion: {
    label: 'Compassion',
    icon: HandRaisedIcon,
    color: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  focus: {
    label: 'Focus',
    icon: EyeIcon,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  clarity: {
    label: 'Clarity',
    icon: BeakerIcon,
    color: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  philosophy: {
    label: 'Philosophy',
    icon: AcademicCapIcon,
    color: 'bg-violet-100 text-violet-800 border-violet-200'
  },
  meditation: {
    label: 'Meditation',
    icon: ScaleIcon,
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  },
  reflection: {
    label: 'Reflection',
    icon: EyeIcon,
    color: 'bg-slate-100 text-slate-800 border-slate-200'
  },
  acceptance: {
    label: 'Acceptance',
    icon: CheckCircleIcon,
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  discipline: {
    label: 'Discipline',
    icon: LockClosedIcon,
    color: 'bg-destructive/10 text-destructive border-destructive/20'
  }
};

export default function FruitTag({ 
  tag, 
  type, 
  size = 'sm', 
  showIcon = true, 
  className = '' 
}: FruitTagProps) {
  const config = type === 'fruit' 
    ? fruitConfig[tag as FruitOfTheSpirit] 
    : wisdomConfig[tag as WisdomTag];
  
  if (!config) return null;
  
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
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
        inline-flex items-center gap-1
        font-medium
        transition-colors duration-200
        border
        ${className}
      `}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  );
}
