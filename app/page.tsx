"use client"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import FeaturedYachts from "@/components/featured-yachts"
import Footer from "@/components/footer"
import Features from "@/components/Features"
import Testimonials from "@/components/Testimonials"
import { Pitch } from "@/components/pitch"
import ChatbotWrapper from "@/components/chatbot-wrapper"


export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <Pitch />
      <Features />
      <FeaturedYachts />
      <Testimonials />
      <Footer />
      <ChatbotWrapper autoOpen={true} />
    </main>
  )
}