
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import RecommendationHistory from "../steps/RecommendationHistory";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRecommendationId: string | null;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  currentRecommendationId
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Recommendation History</SheetTitle>
          <SheetDescription>
            View all your previous diet recommendations and compare them with your current one.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          {currentRecommendationId && (
            <RecommendationHistory currentRecommendationId={currentRecommendationId} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer;
