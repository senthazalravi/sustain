import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, Heart, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockListings = [
  {
    id: 1,
    title: "Vintage Canon AE-1 Camera",
    category: "Electronics",
    condition: "Good",
    price: 150,
    coins: 1500,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400",
    seller: "PhotoLover",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Designer Leather Jacket",
    category: "Fashion",
    condition: "Like New",
    price: 200,
    coins: 2000,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    seller: "Fashionista",
    rating: 5.0,
  },
  {
    id: 3,
    title: "Wooden Coffee Table",
    category: "Home & Garden",
    condition: "Good",
    price: 80,
    coins: 800,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400",
    seller: "HomeDecor",
    rating: 4.5,
  },
  {
    id: 4,
    title: "Apple iPad Pro 2020",
    category: "Electronics",
    condition: "Like New",
    price: 450,
    coins: 4500,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    seller: "TechGuru",
    rating: 4.9,
  },
  {
    id: 5,
    title: "Vintage Vinyl Records Set",
    category: "Music",
    condition: "Good",
    price: 120,
    coins: 1200,
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400",
    seller: "MusicCollector",
    rating: 4.7,
  },
  {
    id: 6,
    title: "Mountain Bike - Trek",
    category: "Sports",
    condition: "Good",
    price: 350,
    coins: 3500,
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400",
    seller: "OutdoorLife",
    rating: 4.6,
  },
];

const Marketplace = () => {
  const navigate = useNavigate();
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
            />
          </div>
          
          <div className="flex gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockListings.map((listing) => (
            <Card 
              key={listing.id} 
              className="overflow-hidden transition-all hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/product/${listing.id}`)}
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <img 
                    src={listing.image} 
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
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{listing.seller}</span>
                  <span>•</span>
                  <span>⭐ {listing.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-lg font-bold text-primary">
                      <Coins className="h-5 w-5" />
                      {listing.coins}
                    </div>
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

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Listings
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
