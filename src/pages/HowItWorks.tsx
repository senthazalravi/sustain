import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Camera, Coins, Package, Search, Sparkles, CheckCircle, TrendingUp, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Upload Your Item",
    description: "Take clear photos of your item (1-10 photos). Add details like title, category, condition, and description.",
    details: [
      "Capture multiple angles for better visibility",
      "Include any defects or wear marks honestly",
      "Choose the right category for easier discovery",
      "Describe condition accurately (New, Like New, Good, Fair, Poor)"
    ]
  },
  {
    icon: Sparkles,
    step: "02",
    title: "AI Analysis & Valuation",
    description: "Our AI instantly analyzes your photos and details to suggest optimal EcoCoin pricing and sustainability impact.",
    details: [
      "AI examines condition, brand, and market demand",
      "Suggests fair EcoCoin pricing automatically",
      "Calculates environmental impact (CO₂ saved, waste reduced)",
      "You can accept or adjust the AI suggestion"
    ]
  },
  {
    icon: Search,
    step: "03",
    title: "List & Get Discovered",
    description: "Your listing goes live instantly. Buyers can find it through search, filters, and category browsing.",
    details: [
      "Listing appears in marketplace immediately",
      "Buyers search by category, condition, price range",
      "Your sustainability impact is highlighted",
      "Build your seller reputation with each transaction"
    ]
  },
  {
    icon: Package,
    step: "04",
    title: "Sell & Earn EcoCoins",
    description: "When a buyer purchases, ship the item with tracking. After delivery confirmation, EcoCoins are credited to your wallet.",
    details: [
      "Secure escrow holds coins until delivery confirmed",
      "Ship with tracking for buyer confidence",
      "Buyer confirms receipt and condition",
      "EcoCoins credited automatically to your wallet"
    ]
  },
];

const benefits = [
  {
    icon: Coins,
    title: "EcoCoin Economy",
    description: "Earn platform coins by selling sustainable items. Use coins to buy from the marketplace or withdraw to cash.",
  },
  {
    icon: TrendingUp,
    title: "Build Reputation",
    description: "Earn ratings and reviews from buyers. Higher reputation means more trust and faster sales.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "All payments protected by escrow system. Coins released only after buyer confirms delivery.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-6 text-5xl font-bold text-foreground md:text-6xl">
                How Sustain Works
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                A sustainable marketplace powered by AI, secured by technology, and driven by community. 
                Sell your items, earn EcoCoins, and make a positive environmental impact.
              </p>
              <Link to="/create-listing">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Coins className="h-5 w-5 mr-2" />
                  Start Selling Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
                Four Simple Steps
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                From listing to earning, the process is seamless and sustainable
              </p>
            </div>

            <div className="space-y-24">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col lg:flex-row gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-lg mb-6">
                      <step.icon className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <div className="text-sm font-bold text-primary mb-3">{step.step}</div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">{step.title}</h3>
                    <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className="bg-muted/50 rounded-2xl p-8 border-2 border-border h-80 flex items-center justify-center">
                      <step.icon className="h-32 w-32 text-muted-foreground/20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
                Why Choose Sustain?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                More than just a marketplace - a complete sustainable selling experience
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-border bg-card transition-all hover:shadow-lg hover:scale-105">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
                Ready to Start?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join our sustainable community marketplace today. Turn your unused items into EcoCoins and make a positive environmental impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/create-listing">
                  <Button size="lg" className="text-lg px-8 py-6">
                    <Coins className="h-5 w-5 mr-2" />
                    List Your First Item
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    <Search className="h-5 w-5 mr-2" />
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
