"use client";

import React from 'react';
import { Box, Stack, Skeleton } from '@mui/material';

/**
 * Skeleton placeholder matching the layout of the Parameter component.
 */
export default function ParameterSkeleton() {
  return (
    <Box sx={{ width: '100%' }}>      
      {/* Title skeleton */}
      <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />      
      {/* Row of 4 fields (Range, Percent, Tolerance, Penalty) */}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {[...Array(4)].map((_, i) => (
          <Box
            key={i}
            sx={{
              flex: '1 1 110px',
              minWidth: 110,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Skeleton variant="rounded" width="100%" height={40} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
