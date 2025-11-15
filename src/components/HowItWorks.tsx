import { Camera, Coins, Package, Search } from "lucide-react";
import stepUpload from "@/assets/step-upload.jpg";
import stepValuation from "@/assets/step-valuation.jpg";
import stepDiscover from "@/assets/step-discover.jpg";
import stepShipping from "@/assets/step-shipping.jpg";

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Upload Your Item",
    description: "Take photos and add details. Our AI will analyze and suggest pricing automatically.",
    image: stepUpload,
  },
  {
    icon: Coins,
    step: "02",
    title: "Get AI Valuation",
    description: "Receive instant pricing in eco coins based on condition, brand, and market demand.",
    image: stepValuation,
  },
  {
    icon: Search,
    step: "03",
    title: "List & Get Discovered",
    description: "Your listing goes live instantly. Buyers can find it through search and filters.",
    image: stepDiscover,
  },
  {
    icon: Package,
    step: "04",
    title: "Ship & Earn Coins",
    description: "Once sold, ship the item. After delivery confirmation, coins are credited to your wallet.",
    image: stepShipping,
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Selling sustainably has never been easier. Just four simple steps to turn your unused items into eco coins.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-32 hidden h-0.5 w-full bg-gradient-to-r from-primary to-primary-dark lg:block"></div>
              )}
              
              <div className="relative z-10 text-center">
                <div className="mx-auto mb-6 overflow-hidden rounded-2xl shadow-lg">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="h-48 w-full object-cover"
                  />
                </div>
                
                <div className="mb-3 text-sm font-bold text-primary">{step.step}</div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
