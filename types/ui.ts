/**
 * UI State Types for RescueStream Dashboard
 * Based on data-model.md specification
 */

import type { StreamWithBroadcaster } from './api';
import type {
  SortingState,
  PaginationState,
  ColumnFiltersState,
} from '@tanstack/react-table';

export interface StreamGridState {
  streams: StreamWithBroadcaster[];
  page: number;
  pageSize: 9;
  totalPages: number;
  selectedStreamId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface TableState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  sorting: SortingState;
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
}
