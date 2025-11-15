import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Package, Truck, CheckCircle, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Order {
  id: string;
  amount_ecocoins: number;
  status: string;
  created_at: string;
  shipped_at: string | null;
  completed_at: string | null;
  tracking_number: string | null;
  listings: {
    title: string;
    photos: string[];
  };
}

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [buyerOrders, setBuyerOrders] = useState<Order[]>([]);
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    // Fetch orders where user is buyer
    const { data: buyerData } = await supabase
      .from("orders")
      .select(`
        id,
        amount_ecocoins,
        status,
        created_at,
        shipped_at,
        completed_at,
        tracking_number,
        listings (title, photos)
      `)
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });

    // Fetch orders where user is seller
    const { data: sellerData } = await supabase
      .from("orders")
      .select(`
        id,
        amount_ecocoins,
        status,
        created_at,
        shipped_at,
        completed_at,
        tracking_number,
        listings (title, photos)
      `)
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    setBuyerOrders((buyerData as any) || []);
    setSellerOrders((sellerData as any) || []);
    setLoading(false);
  };

  const handleMarkAsShipped = async (orderId: string) => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking Number Required",
        description: "Please enter a tracking number",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("orders")
      .update({
        status: "shipped",
        tracking_number: trackingNumber,
        shipped_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Updated",
      description: "Order marked as shipped",
    });

    setTrackingNumber("");
    setSelectedOrderId("");
    fetchOrders();
  };

  const handleConfirmDelivery = async (orderId: string) => {
    setConfirming(true);

    const { data, error } = await supabase.functions.invoke("confirm-delivery", {
      body: { orderId },
    });

    if (error || data?.error) {
      toast({
        title: "Error",
        description: data?.error || "Failed to confirm delivery",
        variant: "destructive",
      });
      setConfirming(false);
      return;
    }

    toast({
      title: "Delivery Confirmed",
      description: "Payment has been released to the seller",
    });

    setConfirming(false);
    fetchOrders();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      pending: { variant: "secondary", icon: Package },
      shipped: { variant: "default", icon: Truck },
      completed: { variant: "outline", icon: CheckCircle },
      cancelled: { variant: "destructive", icon: Package },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const OrderCard = ({ order, isSeller }: { order: Order; isSeller: boolean }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-lg bg-muted flex-shrink-0">
            {order.listings?.photos?.[0] ? (
              <img
                src={order.listings.photos[0]}
                alt={order.listings.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{order.listings?.title || "Item"}</h3>
                <p className="text-sm text-muted-foreground">
                  Order ID: {order.id.substring(0, 8)}...
                </p>
              </div>
              {getStatusBadge(order.status)}
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Coins className="h-4 w-4" />
              <span className="font-semibold">{order.amount_ecocoins} EcoCoins</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ordered: {new Date(order.created_at).toLocaleDateString()}
            </p>
            {order.tracking_number && (
              <p className="text-sm text-muted-foreground">
                Tracking: {order.tracking_number}
              </p>
            )}
            <div className="flex gap-2 pt-2">
              {isSeller && order.status === "pending" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setSelectedOrderId(order.id)}>
                      <Truck className="h-4 w-4 mr-2" />
                      Mark as Shipped
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mark Order as Shipped</DialogTitle>
                      <DialogDescription>
                        Enter the tracking number for this shipment
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="tracking">Tracking Number</Label>
                        <Input
                          id="tracking"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => handleMarkAsShipped(order.id)}>
                        Confirm Shipment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {!isSeller && order.status === "shipped" && (
                <Button
                  size="sm"
                  onClick={() => handleConfirmDelivery(order.id)}
                  disabled={confirming}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {confirming ? "Confirming..." : "Confirm Delivery"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          <h1 className="mb-2 text-4xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">Track your purchases and sales</p>
        </div>

        <Tabs defaultValue="purchases" className="space-y-6">
          <TabsList>
            <TabsTrigger value="purchases">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Purchases
            </TabsTrigger>
            <TabsTrigger value="sales">
              <Package className="h-4 w-4 mr-2" />
              Sales
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="space-y-4">
            {buyerOrders.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Purchases Yet</CardTitle>
                  <CardDescription>
                    Browse the marketplace to start buying sustainable items
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              buyerOrders.map((order) => <OrderCard key={order.id} order={order} isSeller={false} />)
            )}
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            {sellerOrders.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Sales Yet</CardTitle>
                  <CardDescription>
                    Create a listing to start selling your items
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              sellerOrders.map((order) => <OrderCard key={order.id} order={order} isSeller={true} />)
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
