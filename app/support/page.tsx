"use client";

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MessageCircle, MapPin, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/hooks/use-toast"
import Navigation from "@/components/navigation";
import { createClient } from "@/utils/supabase/client";
import EmailSupportDialog from "@/components/EmailSupportDialog";

function EmailSupportButton() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? "guest@example.com");
    }
    fetchUser();
  }, []);

  const handleSendEmail = async () => {
    const to = "marina@gmail.com";
    const subject = "Yacht Support Request (Test Mode)";
    const body = `Hello Marina Team,\n\nThis is a test support request from ${userEmail}.\n\nRegards,\nYacht Website`;

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: userEmail, to, subject, body }),
      });

      const result = await res.json();
      toast({
        title: "📧 " + result.message,
        description: `From: ${userEmail}\nTo: ${to}`,
      });
    } catch (error) {
      toast({
        title: "❌ Failed to send email",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleSendEmail}
      className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300"
    >
      Send Test Email
    </Button>
  );
}
export default function Support() {
  const [showOptions, setShowOptions] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    enquiryType: "",
    location: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Frontend validation
    if (!formData.fullName || !formData.email || !formData.subject || !formData.enquiryType || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.enquiryType === "emergency" && !formData.location) {
      toast({
        title: "Location Required",
        description: "Please provide your current location for emergency assistance.",
        variant: "destructive",
      })
      return
    }

    // Simulate submission
    toast({
      title: "Message Sent Successfully!",
      description: "Our team will contact you within 24 hours.",
    })

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      subject: "",
      enquiryType: "",
      location: "",
      message: "",
    })
  }

  const scrollToForm = () => {
    const formElement = document.getElementById("contact-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
      setFormData(prev => ({ ...prev, enquiryType: "emergency" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <Navigation />
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="assets/yachtvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(200_75%_55%/0.2),transparent_50%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
            We're Here to Help
          </h1>
          <p className="text-xl md:text-2xl text-white/95 font-light max-w-2xl mx-auto">
            Our team is ready 24/7 to assist you on and off the water
          </p>
        </motion.div>
      </section>

      {/* Emergency Banner */}
      {/* <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-destructive text-destructive-foreground py-6 px-4"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 flex-shrink-0" />
            <p className="text-lg font-medium">
              ⚠️ If your yacht is in distress, call our 24/7 Emergency Line: <strong>+1-800-YACHT-SOS</strong>
            </p>
          </div>
          <Button
            onClick={scrollToForm}
            variant="secondary"
            size="lg"
            className="bg-white text-destructive hover:bg-white/90 font-semibold whitespace-nowrap"
          >
            Request Immediate Assistance
          </Button>
        </div>
      </motion.section> */}

      {/* Support Contact Cards */}
      <section className="py-5 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground text-lg">Choose your preferred way to reach us</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Email Support */}

            <Card className="group relative overflow-hidden bg-card border-2 border-primary/10 shadow-large hover:shadow-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Email Support</h3>
                <p className="text-muted-foreground mb-6 text-base">
                  Get answers within 24 hours
                </p>

                <EmailSupportDialog />
              </CardContent>
            </Card>


            {/* Call Us */}
            <Card className="group relative overflow-hidden bg-card border-2 border-accent/10 shadow-large hover:shadow-xl hover:border-accent/30 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Call Us</h3>
                <p className="text-muted-foreground mb-6 text-base">
                  Available 24/7 for emergencies
                </p>

                {/* Toggle options */}
                <div className="flex flex-col items-center space-y-4">
                  <Button
                    onClick={() => setShowOptions((prev) => !prev)}
                    className="bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent text-primary-foreground font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    +1-800-YACHT-SOS
                  </Button>

                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4"
                    >
                      <Button
                        onClick={() => (window.location.href = 'tel:+1800YACHTSOS')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        📞 Call Now
                      </Button>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText('+1-800-YACHT-SOS');
                          toast({
                            title: 'Number Copied',
                            description: '+1-800-YACHT-SOS copied to clipboard.',
                          });
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        📋 Copy Number
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>


            {/* Live Chat */}
            <Card className="group relative overflow-hidden bg-card border-2  shadow-large hover:shadow-xl hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Live Chat</h3>
                <p className="text-muted-foreground mb-6 text-base">
                  Instant support from our team
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-5 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(210_80%_35%/0.05),transparent_50%)]" />

        <div className="max-w-3xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Send Us a Message</h2>
            <p className="text-center text-muted-foreground mb-10 text-lg">
              Fill out the form below and we'll get back to you as soon as possible
            </p>

            <Card className="bg-card/95 backdrop-blur-md border-2 border-primary/10 shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="enquiryType">Enquiry Type *</Label>
                    <select
                      id="enquiryType"
                      value={formData.enquiryType}
                      onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                      className="w-full border border-input bg-background rounded-md p-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select enquiry type</option>
                      <option value="general">General Support</option>
                      <option value="booking">Booking / Payment Help</option>
                      <option value="technical">Technical Issue</option>
                      <option value="emergency">Yacht Stuck / Emergency Assistance</option>
                    </select>
                  </div>

                  {formData.enquiryType === "emergency" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label htmlFor="location" className="text-destructive">
                        Current Location / Coordinates *
                      </Label>
                      <Textarea
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., 25.7617° N, 80.1918° W or Miami Beach Marina"
                        rows={3}
                        className="border-destructive/50 focus-visible:ring-destructive"
                      />
                    </motion.div>
                  )}

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your enquiry..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Quick answers to common questions
            </p>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card/80 border-2 border-primary/10 rounded-xl px-6 shadow-medium hover:shadow-large transition-shadow duration-300">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  How do I contact the crew during my charter?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  You'll receive direct contact information for your captain and crew upon booking confirmation. Additionally, all yachts are equipped with satellite communication systems for reliable contact anywhere in the world.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card/80 border-2 border-primary/10 rounded-xl px-6 shadow-medium hover:shadow-large transition-shadow duration-300">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  What if my yacht requires towing or emergency assistance?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Call our 24/7 emergency hotline at +1-800-YACHT-SOS immediately. We have partnerships with marine rescue services worldwide and will coordinate assistance within minutes. Select "Yacht Stuck / Emergency Assistance" in the contact form above for urgent situations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card/80 border-2 border-primary/10 rounded-xl px-6 shadow-medium hover:shadow-large transition-shadow duration-300">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  Can I modify my booking after confirmation?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, modifications are possible subject to availability and our cancellation policy. Contact us at least 14 days before your charter date for the best options. Fees may apply depending on the nature of changes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card/80 border-2 border-primary/10 rounded-xl px-6 shadow-medium hover:shadow-large transition-shadow duration-300">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and cryptocurrency for select bookings. A 50% deposit is required upon booking, with the remaining balance due 30 days before departure.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card/80 border-2 border-primary/10 rounded-xl px-6 shadow-medium hover:shadow-large transition-shadow duration-300">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  How quickly will I receive a response to my enquiry?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  General enquiries are typically answered within 24 hours during business days. Emergency requests receive immediate attention. For the fastest response, use our live chat feature or call our hotline directly.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Visit Our Marina</h2>
            <p className="text-center text-muted-foreground mb-10 text-lg">
              Located in the heart of Miami's luxury waterfront district
            </p>

            <Card className="overflow-hidden shadow-xl border-2 border-primary/10">
              <CardContent className="p-0">
                <div className="relative w-full h-[500px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.684817037982!2d39.10970877502424!3d21.595166780173457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3db8a3642a02d%3A0xb2397d43878f9a9d!2sJeddah%20Yacht%20Club!5e0!3m2!1sen!2ssa!4v1730000000000!5m2!1sen!2ssa"
                    width="100%"
                    height="500"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Jeddah Yacht Club, Saudi Arabia"
                  />

                </div>
                <div className="p-6 bg-card flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Luxury Yacht Headquarters</h3>
                    <p className="text-muted-foreground">
                      300 Alton Road, Miami Beach, FL 33139<br />
                      Monday - Sunday: 8:00 AM - 8:00 PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
