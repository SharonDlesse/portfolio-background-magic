import React from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Keeping this component for backward compatibility, but it won't be actively used
interface FeaturedProjectToggleProps {
  isFeatured: boolean;
  onToggle: () => void;
}

const FeaturedProjectToggle: React.FC<FeaturedProjectToggleProps> = ({
  isFeatured,
  onToggle
}) => {
  // This component is kept for compatibility but won't be actively used
  return null;
};

export default FeaturedProjectToggle;
