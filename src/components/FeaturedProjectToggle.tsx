
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface FeaturedProjectToggleProps {
  isFeatured: boolean;
  onToggle: () => void;
}

const FeaturedProjectToggle: React.FC<FeaturedProjectToggleProps> = ({
  isFeatured,
  onToggle
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={isFeatured ? "default" : "outline"} 
            size="sm" 
            className={`h-8 w-8 ${isFeatured ? 'bg-amber-500 hover:bg-amber-600' : 'text-muted-foreground'}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <Star className={`h-4 w-4 ${isFeatured ? 'fill-white' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isFeatured ? 'Remove from featured' : 'Add to featured'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FeaturedProjectToggle;
