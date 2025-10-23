"use client"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import FeaturedYachts from "@/components/featured-yachts"
import Footer from "@/components/footer"
import Chatbot from "@/components/chatbot"
import Features from "@/components/Features"
import Testimonials from "@/components/Testimonials"


export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturedYachts />
         <Features />
         <Testimonials />
      <Chatbot />
      </main>
)
}