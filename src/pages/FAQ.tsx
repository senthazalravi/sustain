import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqCategories = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is Sustain?",
        answer: "Sustain is a sustainable marketplace where you can buy and sell pre-owned items using our eco coins currency. Our AI-powered platform helps price items fairly, reduces waste, and builds a circular economy."
      },
      {
        question: "How do I create an account?",
        answer: "Click 'Sign In' in the navigation menu, then select 'Sign Up'. Enter your email and create a password. You'll receive a verification email to activate your account."
      },
      {
        question: "Is Sustain free to use?",
        answer: "Yes! Creating an account and browsing listings is completely free. We only charge a small transaction fee when items are sold, which helps maintain the platform."
      }
    ]
  },
  {
    category: "Eco Coins",
    questions: [
      {
        question: "What are Eco Coins?",
        answer: "Eco Coins are our platform currency that sellers earn when they sell items. You can use coins to purchase other items on the marketplace or withdraw them as cash once you reach the minimum threshold."
      },
      {
        question: "How do I earn Eco Coins?",
        answer: "You earn coins by selling items on Sustain. The AI suggests a coin value based on your item's condition, category, and market demand. Once a buyer confirms receipt, the coins are credited to your wallet."
      },
      {
        question: "Can I withdraw my Eco Coins?",
        answer: "Yes! Once you reach the minimum withdrawal threshold, you can request a payout to your linked bank account. Withdrawals typically process within 3-5 business days."
      },
      {
        question: "How do EcoCoins work?",
        answer: "EcoCoins are our marketplace currency. You earn EcoCoins by selling items and can use them to purchase from other sellers. The coin-based economy promotes sustainable trading within our community."
      }
    ]
  },
  {
    category: "Selling Items",
    questions: [
      {
        question: "How do I create a listing?",
        answer: "Click 'Sell Now' in the navigation menu. Upload photos of your item, add a title and description, select the condition, and our AI will suggest a price. Review the suggestions and publish your listing."
      },
      {
        question: "How does AI pricing work?",
        answer: "Our AI analyzes your photos and description to detect the category, brand, condition, and market value. It suggests both a coin price and equivalent cash value based on similar items and current demand."
      },
      {
        question: "How many photos can I upload?",
        answer: "You can upload up to 10 photos per listing. We recommend using clear, well-lit photos from multiple angles to help buyers make informed decisions."
      },
      {
        question: "What items are prohibited?",
        answer: "We don't allow illegal items, weapons, hazardous materials, counterfeit goods, or items that violate our sustainability mission. Our AI flags potentially prohibited items during listing creation."
      }
    ]
  },
  {
    category: "Buying Items",
    questions: [
      {
        question: "How do I purchase an item?",
        answer: "Browse the marketplace, click on an item you're interested in, and click 'Buy Now'. You can pay with eco coins from your wallet or use a credit/debit card."
      },
      {
        question: "Is my purchase protected?",
        answer: "Yes! All payments go into escrow until you confirm receipt of the item. If there's an issue, you can open a dispute and our support team will help resolve it."
      },
      {
        question: "What if the item isn't as described?",
        answer: "Contact the seller first to resolve the issue. If that doesn't work, open a dispute through your purchase history. You may be eligible for a refund based on our buyer protection policy."
      },
      {
        question: "Can I return an item?",
        answer: "Return policies vary by seller. Check the listing details before purchasing. Some sellers offer 7, 14, or 30-day returns, while others don't accept returns."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        question: "How does shipping work?",
        answer: "After purchase, the seller receives your shipping details. They mark the item as shipped and provide tracking information. You'll receive notifications as the package moves."
      },
      {
        question: "Who pays for shipping?",
        answer: "Shipping costs are set by the seller and included in the item price. Some sellers offer free shipping, while others charge based on the carrier and delivery speed."
      },
      {
        question: "What if my item doesn't arrive?",
        answer: "First, check the tracking information. If the item is lost or significantly delayed, contact the seller. You can also open a dispute, and we'll investigate and help resolve the issue."
      },
      {
        question: "Can I arrange local pickup?",
        answer: "Yes! Some sellers offer local pickup as an option. This is great for larger items and helps reduce shipping costs and environmental impact."
      }
    ]
  },
  {
    category: "Account & Security",
    questions: [
      {
        question: "How do I update my profile?",
        answer: "Go to your account settings to update your name, address, payment methods, and notification preferences. Keep your information current for smooth transactions."
      },
      {
        question: "Is my payment information secure?",
        answer: "Absolutely. We use industry-standard encryption and never store full credit card details. All payment processing is handled by certified payment providers."
      },
      {
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the sign-in page. Enter your email address, and we'll send you a secure link to reset your password."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, you can request account deletion in your settings. Please withdraw any remaining eco coins and complete pending transactions before deleting your account."
      }
    ]
  },
  {
    category: "Sustainability",
    questions: [
      {
        question: "How does Sustain help the environment?",
        answer: "By facilitating the resale of pre-owned items, we extend product lifecycles, reduce waste, and decrease demand for new manufacturing. Every item sold saves resources and reduces carbon emissions."
      },
      {
        question: "What is the circular economy?",
        answer: "A circular economy keeps products and materials in use for as long as possible through reuse, repair, and recycling. Sustain is built on these principles to create a more sustainable future."
      },
      {
        question: "Do you offer carbon-neutral shipping?",
        answer: "We partner with carriers that offer carbon offset programs. Look for the 'eco shipping' badge on listings to support carbon-neutral delivery options."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to know about buying, selling, and earning eco coins on Sustain
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-2xl">{category.category}</CardTitle>
                <CardDescription>
                  Common questions about {category.category.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="mx-auto max-w-2xl border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Still have questions?</CardTitle>
              <CardDescription>
                Can't find the answer you're looking for? Our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Email us at{" "}
                <a 
                  href="mailto:support@sustain.eco" 
                  className="font-medium text-primary hover:underline"
                >
                  support@sustain.eco
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24 hours
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
