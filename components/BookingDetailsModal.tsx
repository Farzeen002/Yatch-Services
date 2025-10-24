"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Calendar, MapPin, Users, Clock, Mail, Phone, CreditCard,
  FileText, Anchor, Download, Edit, Trash2, MessageSquare,
  CheckCircle, AlertCircle, DollarSign, Ship, Utensils
} from "lucide-react";

interface BookingDetailsModalProps {
  booking: any;
  open: boolean;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, open, onClose }: BookingDetailsModalProps) {
  if (!booking) return null;

  const calculateDays = (start: string, end: string) => {
    return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "completed":
        return "bg-primary/10 text-primary border-primary/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success border-success/20";
      case "partial":
        return "bg-warning/10 text-warning border-warning/20";
      case "unpaid":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "refunded":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-auto w-full max-w-[200rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <Ship className="h-6 w-6 text-primary" />
                {booking.yachtName}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Booking Reference: {booking.bookingRef}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
              <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
                {booking.paymentStatus}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Booking Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Check-in Date</label>
                    <p className="font-medium">
                      {new Date(booking.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Check-out Date</label>
                    <p className="font-medium">
                      {new Date(booking.endDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Duration</label>
                    <p className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {calculateDays(booking.startDate, booking.endDate)} days
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Location</label>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {booking.location}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Number of Guests</label>
                    <p className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      {booking.guests} guests
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Crew Members</label>
                    <p className="font-medium flex items-center gap-2">
                      <Anchor className="h-4 w-4 text-primary" />
                      {booking.crew} crew members
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Special Notes
              </h3>
              <p className="text-muted-foreground">
                {booking.notes || "No special notes for this booking."}
              </p>
            </Card>
          </TabsContent>

          {/* Customer Tab */}
          <TabsContent value="customer" className="space-y-4 mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Customer Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <p className="font-medium text-lg">{booking.customerName}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm text-muted-foreground">Email Address</label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${booking.customerEmail}`} className="text-primary hover:underline">
                      {booking.customerEmail}
                    </a>
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm text-muted-foreground">Phone Number</label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href={`tel:${booking.customerPhone}`} className="text-primary hover:underline">
                      {booking.customerPhone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4 mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-2xl font-bold text-foreground">
                    ${booking.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-success/5 rounded-lg border border-success/20">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="text-xl font-semibold text-success">
                    ${booking.paidAmount.toLocaleString()}
                  </span>
                </div>
                {booking.paidAmount < booking.price && (
                  <div className="flex justify-between items-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                    <span className="text-muted-foreground">Balance Due</span>
                    <span className="text-xl font-semibold text-destructive">
                      ${(booking.price - booking.paidAmount).toLocaleString()}
                    </span>
                  </div>
                )}
                <Separator />
                <div>
                  <label className="text-sm text-muted-foreground">Payment Status</label>
                  <div className="mt-2">
                    <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
                      {booking.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {booking.paymentStatus !== "paid" && booking.status !== "cancelled" && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                  <Button className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payment
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Send Invoice
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Payment History</h3>
              <div className="space-y-3">
                {booking.paymentStatus === "paid" || booking.paymentStatus === "partial" ? (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium">Payment Received</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">${booking.paidAmount.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No payment history available
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-4 mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                Included Amenities & Services
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {booking.amenities.map((amenity: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Add-on Services</h3>
              <p className="text-muted-foreground text-center py-4">
                No additional services requested
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-border">
          <Button variant="outline" className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Edit Booking
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Contract
          </Button>
          {booking.status !== "cancelled" && booking.status !== "completed" && (
            <Button variant="destructive" className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
