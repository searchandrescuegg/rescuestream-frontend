"use client"

import { useState, useCallback } from "react"
import { IconSearch, IconX } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AuditLogFilters as FilterState } from "@/types"

const EVENT_TYPES = [
  { value: "stream_started", label: "Stream Started" },
  { value: "user_login", label: "User Login" },
  { value: "user_logout", label: "User Logout" },
  { value: "stream_key_created", label: "Stream Key Created" },
  { value: "stream_key_updated", label: "Stream Key Updated" },
  { value: "stream_key_deleted", label: "Stream Key Deleted" },
  { value: "broadcaster_created", label: "Broadcaster Created" },
  { value: "broadcaster_updated", label: "Broadcaster Updated" },
  { value: "broadcaster_deleted", label: "Broadcaster Deleted" },
]

interface AuditLogFiltersProps {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  onClearFilters: () => void
}

export function AuditLogFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: AuditLogFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.actor ?? "")

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onFilterChange({ actor: searchValue || undefined })
    },
    [searchValue, onFilterChange]
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
    },
    []
  )

  const handleEventTypeChange = useCallback(
    (value: string) => {
      onFilterChange({ eventType: value === "all" ? undefined : value })
    },
    [onFilterChange]
  )

  const hasActiveFilters = !!(filters.eventType || filters.actor)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 gap-4">
        {/* Event Type Filter */}
        <Select
          value={filters.eventType ?? "all"}
          onValueChange={handleEventTypeChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search by User */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-8 w-[200px]"
            />
          </div>
          <Button type="submit" variant="secondary" size="icon">
            <IconSearch className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearchValue("")
            onClearFilters()
          }}
          className="text-muted-foreground"
        >
          <IconX className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
