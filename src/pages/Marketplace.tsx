import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, Heart, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Listing {
  id: string;
  title: string;
  category: string;
  condition: string;
  price_ecocoins: number;
  photos: string[];
  description: string;
}

const Marketplace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load listings",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setListings(data || []);
    setLoading(false);
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || 
                           listing.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Marketplace</h1>
          <p className="text-muted-foreground">Discover sustainable treasures from our community</p>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search for items..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="toys">Toys</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-64 w-full animate-pulse bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 w-20 animate-pulse bg-muted rounded mb-2" />
                  <div className="h-6 w-full animate-pulse bg-muted rounded mb-2" />
                  <div className="h-4 w-32 animate-pulse bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No listings found</p>
            <Button className="mt-4" onClick={() => navigate("/create-listing")}>
              Create Your First Listing
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <Card 
                key={listing.id} 
                className="overflow-hidden transition-all hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/product/${listing.id}`)}
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={listing.photos?.[0] || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400"} 
                      alt={listing.title}
                      className="h-64 w-full object-cover"
                    />
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute right-3 top-3 h-9 w-9 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute left-3 top-3 bg-primary">
                      {listing.condition}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {listing.category}
                  </Badge>
                  <h3 className="mb-2 font-semibold text-foreground line-clamp-1">
                    {listing.title}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-lg font-bold text-primary">
                      <Coins className="h-5 w-5" />
                      {listing.price_ecocoins}
                    </div>
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${listing.id}`);
                    }}>View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredListings.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Showing {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
