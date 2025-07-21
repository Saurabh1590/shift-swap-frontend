import React from 'react';
import Skeleton from './Skeleton';

const DashboardSkeleton = () => {
  return (
    <div>
      {/* Header Skeleton */}
      <Skeleton className="h-10 w-1/3 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-8" />
      
      {/* Tabs Skeleton */}
      <div className="flex space-x-4 mb-6 border-b">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;