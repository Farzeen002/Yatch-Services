"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarDays, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { DateRange } from "react-day-picker"
import { checkYachtAvailability, getAlternativeDates, type YachtAvailability } from "@/lib/availability"

interface BookingCalendarProps {
  onDateSelect: (dates: { start: Date; end: Date | null; isMultiDay: boolean }) => void
  unavailableDates?: Date[]
  yachtId?: number
  yachtAvailabilities?: YachtAvailability[]
}

export default function BookingCalendar({ onDateSelect, unavailableDates = [], yachtId, yachtAvailabilities = [] }: BookingCalendarProps) {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>()
  const [bookingType, setBookingType] = useState<"single" | "multi">("single")
  const [availabilityCheck, setAvailabilityCheck] = useState<{ isAvailable: boolean; message: string; conflictingDates: Date[] } | null>(null)
  const [alternativeDates, setAlternativeDates] = useState<Date[]>([])

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setSelectedDates(undefined)
      setAvailabilityCheck(null)
      setAlternativeDates([])
      return
    }

    setSelectedDates(range)

    const isMultiDay = bookingType === "multi" && range.to && range.from.getTime() !== range.to.getTime()

    // Check availability if yachtId is provided
    if (yachtId && yachtAvailabilities.length > 0) {
      const availability = checkYachtAvailability(
        yachtId,
        range.from,
        isMultiDay ? range.to || null : null,
        yachtAvailabilities
      )

      setAvailabilityCheck(availability)

      if (!availability.isAvailable) {
        const alternatives = getAlternativeDates(
          yachtId,
          range.from,
          isMultiDay ? range.to || null : null,
          yachtAvailabilities
        )
        setAlternativeDates(alternatives.slice(0, 5)) // Show up to 5 alternatives
      } else {
        setAlternativeDates([])
      }
    }

    onDateSelect({
      start: range.from,
      end: isMultiDay ? range.to || null : range.from,
      isMultiDay: !!isMultiDay
    })
  }

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate =>
      unavailableDate.toDateString() === date.toDateString()
    )
  }

  const getDateRangeText = () => {
    if (!selectedDates?.from) return "Select dates"

    if (bookingType === "single") {
      return selectedDates.from.toLocaleDateString()
    }

    if (selectedDates.to) {
      const nights = Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))
      return `${selectedDates.from.toLocaleDateString()} - ${selectedDates.to.toLocaleDateString()} (${nights} nights)`
    }

    return selectedDates.from.toLocaleDateString()
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Booking Type Selection */}
        <div className="flex gap-2">
          <Button
            variant={bookingType === "single" ? "default" : "outline"}
            onClick={() => {
              setBookingType("single")
              setSelectedDates(undefined)
            }}
            className="flex items-center gap-2"
          >
            <Clock size={16} />
            Single Day
          </Button>
          <Button
            variant={bookingType === "multi" ? "default" : "outline"}
            onClick={() => {
              setBookingType("multi")
              setSelectedDates(undefined)
            }}
            className="flex items-center gap-2"
          >
            <CalendarDays size={16} />
            Multi-Day
          </Button>
        </div>

        {/* Selected Dates Display */}
        {selectedDates && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays size={16} className="text-primary" />
              <span className="font-medium">Selected Dates:</span>
            </div>
            <p className="text-sm text-muted-foreground">{getDateRangeText()}</p>
            {bookingType === "multi" && selectedDates.to && selectedDates.from && (
              <Badge variant="secondary" className="mt-2">
                {Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))} nights
              </Badge>
            )}
          </div>
        )}

        {/* Calendar */}
        <div className="flex justify-center">
          {bookingType === "multi" ? (
            <Calendar
              mode="range"
              selected={selectedDates}
              onSelect={handleDateSelect}
              disabled={(date) => {
                // Disable past dates
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (date < today) return true

                // Disable unavailable dates
                return isDateUnavailable(date)
              }}
              className="rounded-md border"
              numberOfMonths={2}
              required
            />
          ) : (
            <Calendar
              mode="single"
              selected={selectedDates?.from}
              onSelect={(date) => {
                if (date) {
                  handleDateSelect({ from: date, to: undefined })
                } else {
                  handleDateSelect(undefined)
                }
              }}
              disabled={(date) => {
                // Disable past dates
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (date < today) return true

                // Disable unavailable dates
                return isDateUnavailable(date)
              }}
              className="rounded-md border"
              numberOfMonths={2}
            />
          )}
        </div>

        {/* Availability Status */}
        {availabilityCheck && (
          <Alert className={availabilityCheck.isAvailable ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-center gap-2">
              {availabilityCheck.isAvailable ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={availabilityCheck.isAvailable ? "text-green-800" : "text-red-800"}>
                {availabilityCheck.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Alternative Dates */}
        {alternativeDates.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Alternative Available Dates:</p>
            <div className="flex flex-wrap gap-2">
              {alternativeDates.map((date, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newRange = bookingType === "multi"
                      ? { from: date, to: new Date(date.getTime() + 24 * 60 * 60 * 1000) }
                      : { from: date, to: undefined }
                    handleDateSelect(newRange)
                  }}
                  className="text-xs"
                >
                  {date.toLocaleDateString()}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Unavailable Dates Info */}
        {/* {unavailableDates.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive font-medium mb-1">Unavailable Dates</p>
            <p className="text-xs text-destructive/80">
              Some dates are already booked. Please select available dates.
            </p>
          </div>
        )} */}
      </div>
    </Card>
  )
}
