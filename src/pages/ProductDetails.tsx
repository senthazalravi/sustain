import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  price_ecocoins: number;
  sustainability_impact: string;
  photos: string[];
  created_at: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchListing();
    if (user) {
      checkAffiliateStatus();
    }
  }, [id, user]);

  const fetchListing = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load listing",
        variant: "destructive",
      });
      navigate("/marketplace");
      return;
    }

    setListing(data);
    setLoading(false);
  };

  const checkAffiliateStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "affiliate")
      .single();

    if (data) {
      setIsAffiliate(true);
      await generateAffiliateLink();
    }
  };

  const generateAffiliateLink = async () => {
    if (!user || !id) return;

    // Check if link already exists
    const { data: existing } = await supabase
      .from("affiliate_links")
      .select("link_code")
      .eq("affiliate_user_id", user.id)
      .eq("listing_id", id)
      .single();

    if (existing) {
      setAffiliateLink(`${window.location.origin}/product/${id}?ref=${existing.link_code}`);
      return;
    }

    // Create new affiliate link
    const linkCode = `${user.id.substring(0, 8)}-${id.substring(0, 8)}`;
    const { error } = await supabase
      .from("affiliate_links")
      .insert({
        affiliate_user_id: user.id,
        listing_id: id,
        link_code: linkCode,
      });

    if (!error) {
      setAffiliateLink(`${window.location.origin}/product/${id}?ref=${linkCode}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const url = affiliateLink || window.location.href;
    const text = `Check out this item: ${listing?.title}`;

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
              {listing.photos && listing.photos.length > 0 ? (
                <img
                  src={listing.photos[selectedImage]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            {listing.photos && listing.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${
                      selectedImage === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={photo} alt={`${listing.title} ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-foreground">{listing.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{listing.category}</Badge>
                <Badge variant="outline">{listing.condition}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-primary" />
              <span className="text-3xl font-bold text-foreground">{listing.price_ecocoins}</span>
              <span className="text-xl text-muted-foreground">EcoCoins</span>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-foreground">Description</h3>
              <p className="text-muted-foreground">{listing.description}</p>
            </div>

            {listing.sustainability_impact && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <h3 className="mb-2 font-semibold text-foreground">Sustainability Impact</h3>
                  <p className="text-sm text-muted-foreground">{listing.sustainability_impact}</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <Button size="lg" className="w-full">
                <Coins className="mr-2 h-5 w-5" />
                Buy Now
              </Button>

              {/* Social Sharing */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full">
                    <Share2 className="mr-2 h-5 w-5" />
                    Share Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share this product</DialogTitle>
                    <DialogDescription>
                      Share on social media or copy the link
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => shareOnSocial("facebook")}>
                        <Facebook className="mr-2 h-4 w-4" />
                        Facebook
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => shareOnSocial("twitter")}>
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => shareOnSocial("linkedin")}>
                        <Linkedin className="mr-2 h-4 w-4" />
                        Linkedin
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input value={affiliateLink || window.location.href} readOnly />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(affiliateLink || window.location.href)}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Affiliate Link for Affiliates */}
              {isAffiliate && affiliateLink && (
                <Card className="border-primary">
                  <CardContent className="pt-6">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <LinkIcon className="h-5 w-5 text-primary" />
                      Your Affiliate Link
                    </h3>
                    <div className="flex gap-2">
                      <Input value={affiliateLink} readOnly className="text-sm" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(affiliateLink)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Share this link and earn 10% commission on every sale!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
