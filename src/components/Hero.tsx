import { Button } from "@/components/ui/button";
import { ArrowRight, Coins, Leaf, Recycle } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75"></div>
      </div>
      
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Leaf className="h-4 w-4" />
            Sustainable Marketplace
          </div>
          
          <h1 className="mb-6 text-5xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
            Buy & Sell with{" "}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Eco Coins
            </span>
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
            Join the sustainable revolution. Resell your unused items, earn platform coins, and help reduce waste while building a circular economy.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/marketplace">
              <Button size="lg" className="w-full sm:w-auto group">
                Browse Marketplace
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/create-listing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Coins className="mr-2 h-5 w-5" />
                Start Selling
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-border pt-8">
            <div>
              <div className="mb-2 text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Active Listings</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-primary">25K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Coins Earned</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
