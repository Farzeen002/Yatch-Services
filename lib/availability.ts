export interface AvailabilityCheck {
  isAvailable: boolean
  conflictingDates: Date[]
  message: string
}

export interface YachtAvailability {
  yachtId: number
  unavailableDates: Date[]
  maintenanceDates: Date[]
}

/**
 * Check if a yacht is available for the selected dates
 */
export function checkYachtAvailability(
  yachtId: number,
  startDate: Date,
  endDate: Date | null,
  yachtAvailabilities: YachtAvailability[]
): AvailabilityCheck {
  // ✅ Fix: match by yachtId, not y.id
  const yacht = yachtAvailabilities.find(y => y.yachtId === yachtId)

  if (!yacht) {
    return {
      isAvailable: false,
      conflictingDates: [],
      message: "Yacht not found"
    }
  }

  // ✅ Fix: prevent "not iterable" error if arrays are undefined/null
  const allUnavailableDates = [
    ...(Array.isArray(yacht.unavailableDates) ? yacht.unavailableDates : []),
    ...(Array.isArray(yacht.maintenanceDates) ? yacht.maintenanceDates : [])
  ]

  const conflictingDates: Date[] = []

  // ✅ Handle single-day booking properly
  const effectiveEndDate = endDate ?? startDate

  // Check date order safely
  if (effectiveEndDate < startDate) {
    return {
      isAvailable: false,
      conflictingDates: [],
      message: "End date cannot be before the start date"
    }
  }

  // Iterate through each day between start and end
  const currentDate = new Date(startDate)
  while (currentDate <= effectiveEndDate) {
    const isUnavailable = allUnavailableDates.some(
      date => date.toDateString() === currentDate.toDateString()
    )

    if (isUnavailable) {
      conflictingDates.push(new Date(currentDate))
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  if (conflictingDates.length > 0) {
    return {
      isAvailable: false,
      conflictingDates,
      message:
        conflictingDates.length === 1
          ? "Yacht is not available on the selected date"
          : `Yacht is not available on ${conflictingDates.length} of the selected dates`
    }
  }

  return {
    isAvailable: true,
    conflictingDates: [],
    message: "Yacht is available for the selected dates"
  }
}

/**
 * Get all unavailable dates for a yacht
 */
export function getYachtUnavailableDates(
  yachtId: number,
  yachtAvailabilities: YachtAvailability[]
): Date[] {
  const yacht = yachtAvailabilities.find(y => y.yachtId === yachtId)
  if (!yacht) return []

  // ✅ Guard against undefined arrays
  const unavailable = Array.isArray(yacht.unavailableDates)
    ? yacht.unavailableDates
    : []
  const maintenance = Array.isArray(yacht.maintenanceDates)
    ? yacht.maintenanceDates
    : []

  return [...unavailable, ...maintenance]
}

/**
 * Check if a specific date is available for a yacht
 */
export function isDateAvailable(
  yachtId: number,
  date: Date,
  yachtAvailabilities: YachtAvailability[]
): boolean {
  const unavailableDates = getYachtUnavailableDates(yachtId, yachtAvailabilities)
  return !unavailableDates.some(
    unavailableDate => unavailableDate.toDateString() === date.toDateString()
  )
}

/**
 * Get alternative available dates near the requested dates
 */
export function getAlternativeDates(
  yachtId: number,
  requestedStart: Date,
  requestedEnd: Date | null,
  yachtAvailabilities: YachtAvailability[],
  daysToCheck: number = 7
): Date[] {
  const unavailableDates = getYachtUnavailableDates(yachtId, yachtAvailabilities)
  const alternatives: Date[] = []

  const effectiveEnd = requestedEnd ?? requestedStart

  for (let i = -daysToCheck; i <= daysToCheck; i++) {
    if (i === 0) continue // Skip the original date

    const checkDate = new Date(requestedStart)
    checkDate.setDate(checkDate.getDate() + i)

    // Skip if this date is unavailable
    const isAvailable = !unavailableDates.some(
      unavailableDate => unavailableDate.toDateString() === checkDate.toDateString()
    )

    if (isAvailable) {
      alternatives.push(new Date(checkDate))
    }
  }

  return alternatives.sort((a, b) => a.getTime() - b.getTime())
}
