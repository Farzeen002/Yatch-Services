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
  const yacht = yachtAvailabilities.find(y => y.id === yachtId)
  
  if (!yacht) {
    return {
      isAvailable: false,
      conflictingDates: [],
      message: "Yacht not found"
    }
  }

  const allUnavailableDates = [...yacht.unavailableDates, ...yacht.maintenanceDates]
  const conflictingDates: Date[] = []
  
  // Check single day booking
  if (!endDate) {
    const isUnavailable = allUnavailableDates.some(date => 
      date.toDateString() === startDate.toDateString()
    )
    
    if (isUnavailable) {
      conflictingDates.push(startDate)
      return {
        isAvailable: false,
        conflictingDates,
        message: "Yacht is not available on the selected date"
      }
    }
  } else {
    // Check multi-day booking
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const isUnavailable = allUnavailableDates.some(date => 
        date.toDateString() === currentDate.toDateString()
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
        message: `Yacht is not available on ${conflictingDates.length} of the selected dates`
      }
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
export function getYachtUnavailableDates(yachtId: number, yachtAvailabilities: YachtAvailability[]): Date[] {
  const yacht = yachtAvailabilities.find(y => y.id === yachtId)
  return yacht ? [...yacht.unavailableDates, ...yacht.maintenanceDates] : []
}

/**
 * Check if a specific date is available for a yacht
 */
export function isDateAvailable(yachtId: number, date: Date, yachtAvailabilities: YachtAvailability[]): boolean {
  const unavailableDates = getYachtUnavailableDates(yachtId, yachtAvailabilities)
  return !unavailableDates.some(unavailableDate => 
    unavailableDate.toDateString() === date.toDateString()
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
  
  // Check dates before and after the requested dates
  for (let i = -daysToCheck; i <= daysToCheck; i++) {
    if (i === 0) continue // Skip the original date
    
    const checkDate = new Date(requestedStart)
    checkDate.setDate(checkDate.getDate() + i)
    
    const isAvailable = !unavailableDates.some(unavailableDate => 
      unavailableDate.toDateString() === checkDate.toDateString()
    )
    
    if (isAvailable) {
      alternatives.push(new Date(checkDate))
    }
  }
  
  return alternatives.sort((a, b) => a.getTime() - b.getTime())
}
