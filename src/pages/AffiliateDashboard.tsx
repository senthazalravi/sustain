import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, MousePointerClick, TrendingUp, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AffiliateStats {
  totalClicks: number;
  totalEarnings: number;
  totalSales: number;
  links: Array<{
    id: string;
    listing_title: string;
    link_code: string;
    clicks: number;
    earnings: number;
  }>;
}

const AffiliateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [stats, setStats] = useState<AffiliateStats>({
    totalClicks: 0,
    totalEarnings: 0,
    totalSales: 0,
    links: [],
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    checkAffiliateStatus();
  }, [user]);

  const checkAffiliateStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "affiliate")
      .single();

    if (!data) {
      toast({
        title: "Access Denied",
        description: "You need to be an affiliate to access this page",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAffiliate(true);
    await fetchAffiliateStats();
  };

  const fetchAffiliateStats = async () => {
    if (!user) return;

    // Fetch total earnings
    const { data: earnings } = await supabase
      .from("affiliate_earnings")
      .select("ecocoins_earned")
      .eq("affiliate_user_id", user.id);

    const totalEarnings = earnings?.reduce((sum, e) => sum + e.ecocoins_earned, 0) || 0;
    const totalSales = earnings?.length || 0;

    // Fetch affiliate links with clicks
    const { data: links } = await supabase
      .from("affiliate_links")
      .select(`
        id,
        link_code,
        listing_id,
        listings (title)
      `)
      .eq("affiliate_user_id", user.id);

    let totalClicks = 0;
    const linkStats = await Promise.all(
      (links || []).map(async (link) => {
        const { data: clicks } = await supabase
          .from("affiliate_clicks")
          .select("id")
          .eq("affiliate_link_id", link.id);

        const clickCount = clicks?.length || 0;
        totalClicks += clickCount;

        const { data: linkEarnings } = await supabase
          .from("affiliate_earnings")
          .select("ecocoins_earned")
          .eq("affiliate_link_id", link.id);

        const linkEarningsTotal = linkEarnings?.reduce((sum, e) => sum + e.ecocoins_earned, 0) || 0;

        return {
          id: link.id,
          listing_title: (link.listings as any)?.title || "Unknown",
          link_code: link.link_code,
          clicks: clickCount,
          earnings: linkEarningsTotal,
        };
      })
    );

    setStats({
      totalClicks,
      totalEarnings,
      totalSales,
      links: linkStats,
    });
    setLoading(false);
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">Track your performance and earnings</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <Coins className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEarnings} EcoCoins</div>
              <p className="text-xs text-muted-foreground">From {stats.totalSales} sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClicks}</div>
              <p className="text-xs text-muted-foreground">Across all your links</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Links</CardTitle>
              <LinkIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.links.length}</div>
              <p className="text-xs text-muted-foreground">Affiliate links created</p>
            </CardContent>
          </Card>
        </div>

        {/* Links Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Your Affiliate Links</CardTitle>
            <CardDescription>Performance breakdown by product</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.links.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No affiliate links yet. Visit product pages to generate your links!
              </p>
            ) : (
              <div className="space-y-4">
                {stats.links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{link.listing_title}</h3>
                      <p className="text-sm text-muted-foreground">Code: {link.link_code}</p>
                    </div>
                    <div className="flex gap-8 text-right">
                      <div>
                        <p className="text-sm text-muted-foreground">Clicks</p>
                        <p className="font-semibold">{link.clicks}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Earnings</p>
                        <p className="font-semibold text-primary">{link.earnings} EC</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Affiliate account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium">Affiliate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commission Rate:</span>
              <span className="font-medium text-primary">10%</span>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateDashboard;
