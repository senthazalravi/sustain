import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Copy, Check, Wallet, Mail, MessageCircle } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

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
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);

  const affiliateRef = searchParams.get('ref');

  useEffect(() => {
    fetchListing();
    if (user) {
      checkAffiliateStatus();
      fetchWalletBalance();
    }
  }, [id, user]);

  const fetchWalletBalance = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setWalletBalance(data.balance);
    }
  };

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

  const handleNativeShare = async () => {
    const url = affiliateLink || window.location.href;
    const text = `Check out this amazing item: ${listing?.title}\n\nPrice: ${listing?.price_ecocoins} EcoCoins\n\n`;

    // Check if native share is available (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title || 'Product',
          text: text,
          url: url,
        });
        
        toast({
          title: "Shared!",
          description: "Thanks for sharing",
        });
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }
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
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(listing?.title || 'Check this out')}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
    }

    if (shareUrl) {
      if (platform === "email") {
        window.location.href = shareUrl;
      } else {
        window.open(shareUrl, "_blank", "width=600,height=400");
      }
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to make a purchase",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (walletBalance < listing!.price_ecocoins) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough EcoCoins",
        variant: "destructive",
      });
      return;
    }

    setShowPurchaseDialog(true);
  };

  const confirmPurchase = async () => {
    setPurchasing(true);

    const { data, error } = await supabase.functions.invoke("process-purchase", {
      body: {
        listingId: id,
        affiliateLinkCode: affiliateRef,
      },
    });

    if (error || data?.error) {
      toast({
        title: "Purchase Failed",
        description: data?.error || "Failed to complete purchase",
        variant: "destructive",
      });
      setPurchasing(false);
      setShowPurchaseDialog(false);
      return;
    }

    toast({
      title: "Purchase Successful!",
      description: "Your order has been placed successfully",
    });

    setPurchasing(false);
    setShowPurchaseDialog(false);
    navigate("/my-orders");
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
            {/* Affiliate Status Badge */}
            {isAffiliate && (
              <Card className="border-green-500 bg-green-50 dark:bg-green-950">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 hover:bg-green-700">Affiliate Mode</Badge>
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Share this product to earn 10% commission!
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

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
              {/* Wallet Balance Display */}
              {user && (
                <Card className="border-muted">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Your Balance:</span>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">{walletBalance} EC</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button size="lg" className="w-full" onClick={handlePurchase}>
                <Coins className="mr-2 h-5 w-5" />
                Buy Now
              </Button>

              {/* Purchase Confirmation Dialog */}
              <AlertDialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to purchase <strong>{listing.title}</strong> for{" "}
                      <strong>{listing.price_ecocoins} EcoCoins</strong>.
                      <br />
                      <br />
                      Your new balance will be: <strong>{walletBalance - listing.price_ecocoins} EC</strong>
                      <br />
                      <br />
                      The coins will be held in escrow until you confirm delivery.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={purchasing}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmPurchase} disabled={purchasing}>
                      {purchasing ? "Processing..." : "Confirm Purchase"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Social Sharing - Native on Mobile, Detailed on Desktop */}
              {typeof navigator !== 'undefined' && navigator.share ? (
                // Mobile: Use native share sheet
                <Button variant="outline" size="lg" className="w-full" onClick={handleNativeShare}>
                  <Share2 className="mr-2 h-5 w-5" />
                  Share Product
                </Button>
              ) : (
                // Desktop: Use detailed dialog
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="w-full">
                      <Share2 className="mr-2 h-5 w-5" />
                      Share Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share this product</DialogTitle>
                      <DialogDescription>
                        {isAffiliate 
                          ? "Share your affiliate link to earn commissions!"
                          : "Share on social media or copy the link"
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Social Media Buttons */}
                      <div>
                        <p className="mb-2 text-sm font-medium text-foreground">Share on Social Media</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" onClick={() => shareOnSocial("facebook")}>
                            <Facebook className="mr-2 h-4 w-4" />
                            Facebook
                          </Button>
                          <Button variant="outline" onClick={() => shareOnSocial("twitter")}>
                            <Twitter className="mr-2 h-4 w-4" />
                            Twitter
                          </Button>
                          <Button variant="outline" onClick={() => shareOnSocial("linkedin")}>
                            <Linkedin className="mr-2 h-4 w-4" />
                            LinkedIn
                          </Button>
                          <Button variant="outline" onClick={() => shareOnSocial("whatsapp")}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Email Share */}
                      <Button variant="outline" className="w-full" onClick={() => shareOnSocial("email")}>
                        <Mail className="mr-2 h-4 w-4" />
                        Share via Email
                      </Button>

                      <Separator />

                      {/* Copy Link */}
                      <div>
                        <p className="mb-2 text-sm font-medium text-foreground">
                          {isAffiliate ? "Your Affiliate Link" : "Product Link"}
                        </p>
                        <div className="flex gap-2">
                          <Input 
                            value={affiliateLink || window.location.href} 
                            readOnly 
                            className="text-sm"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(affiliateLink || window.location.href)}
                          >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        {isAffiliate && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Earn 10% commission when someone buys through your link!
                          </p>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

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
