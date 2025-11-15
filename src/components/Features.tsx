import { Bot, Coins, Lock, Package, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Pricing",
    description: "Our smart AI analyzes your items and suggests optimal pricing in eco coins based on condition, brand, and market trends.",
  },
  {
    icon: Coins,
    title: "Earn Eco Coins",
    description: "Sell items to earn platform coins. Accumulate and withdraw to cash, or use them to buy other sustainable items.",
  },
  {
    icon: Sparkles,
    title: "Auto-Generated Listings",
    description: "AI creates compelling product descriptions and categorizes items automatically from your photos.",
  },
  {
    icon: Lock,
    title: "Secure Escrow",
    description: "All transactions protected by our secure escrow system until delivery is confirmed.",
  },
  {
    icon: Package,
    title: "Easy Shipping",
    description: "Integrated tracking and shipping management makes sending items effortless.",
  },
  {
    icon: TrendingUp,
    title: "Build Reputation",
    description: "Earn ratings and build trust within our sustainable community marketplace.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Why Choose Sustain?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A smarter, more sustainable way to buy and sell. Powered by AI, secured by technology, driven by community.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
