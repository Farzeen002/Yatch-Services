import { Shield, Clock, Users, Star } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Instant Booking",
    description:
      "Book your dream yacht in minutes with our streamlined process. No lengthy paperwork or waiting periods.",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description:
      "Every rental includes comprehensive insurance coverage for complete peace of mind during your journey.",
  },
  {
    icon: Users,
    title: "Professional Crew",
    description:
      "Experienced captains and crew members ensure safe, memorable experiences on every voyage.",
  },
  {
    icon: Star,
    title: "Premium Selection",
    description:
      "Handpicked luxury yachts maintained to the highest standards for your comfort and safety.",
  },
];

export const Pitch = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/30 flex justify-center items-center">
      <div className="w-full max-w-7xl px-6 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Key Features
          </h2>
          <p className="text-xl text-muted-foreground">
            We've simplified luxury yacht rentals to give you more time enjoying
            the open sea and less time dealing with logistics.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl border border-border shadow-soft hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 animate-fadeIn max-w-xs"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 gradient-gold rounded-xl flex items-center justify-center mb-6 shadow-glow mx-auto">
                <feature.icon className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
