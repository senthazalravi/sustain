import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, Camera, Coins, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const CreateListing = () => {
  const [aiSuggested, setAiSuggested] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAISuggest = () => {
    setAiSuggested(true);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    if (photos.length + files.length > 10) {
      toast({
        title: "Too many photos",
        description: "You can upload a maximum of 10 photos",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('listing-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('listing-photos')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      setPhotos([...photos, ...uploadedUrls]);
      toast({
        title: "Photos uploaded",
        description: `Successfully uploaded ${uploadedUrls.length} photo(s)`,
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Create Listing</h1>
          <p className="text-muted-foreground">Let AI help you create the perfect listing</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Upload photos and add information about your item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Photos (minimum 3 required)</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative h-32">
                        <img 
                          src={photo} 
                          alt={`Upload ${index + 1}`} 
                          className="h-full w-full rounded-lg object-cover"
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -right-2 -top-2 h-6 w-6"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 text-xs">
                            Cover
                          </Badge>
                        )}
                      </div>
                    ))}
                    {photos.length < 10 && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button 
                          type="button"
                          variant="outline" 
                          className="h-32 flex-col gap-2 border-dashed"
                          onClick={handlePhotoClick}
                          disabled={uploading || !user}
                        >
                          <Camera className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm">
                            {uploading ? "Uploading..." : "Add Photo"}
                          </span>
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload 3-10 photos. First photo will be the cover image.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Vintage Canon Camera AE-1"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="sports">Sports & Outdoors</SelectItem>
                        <SelectItem value="books">Books & Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your item in detail..."
                    rows={6}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shipping">Shipping Option</Label>
                    <Select>
                      <SelectTrigger id="shipping">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seller-ships">Seller Ships</SelectItem>
                        <SelectItem value="pickup">Local Pickup Only</SelectItem>
                        <SelectItem value="both">Both Options</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="returns">Return Policy</Label>
                    <Select>
                      <SelectTrigger id="returns">
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-returns">No Returns</SelectItem>
                        <SelectItem value="7-days">7 Days</SelectItem>
                        <SelectItem value="14-days">14 Days</SelectItem>
                        <SelectItem value="30-days">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleAISuggest}
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    Get AI Suggestions
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Upload className="mr-2 h-4 w-4" />
                    Publish Listing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Valuation
                </CardTitle>
                <CardDescription>
                  Upload photos to get instant pricing suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!aiSuggested ? (
                  <div className="rounded-lg border border-dashed border-border p-8 text-center">
                    <Bot className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Add photos and click "Get AI Suggestions" to see pricing recommendations
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                        <div>
                          <div className="mb-1 text-sm text-muted-foreground">Suggested Price</div>
                          <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-primary" />
                            <span className="text-2xl font-bold text-foreground">1,200</span>
                          </div>
                          <div className="text-sm text-muted-foreground">≈ $120</div>
                        </div>
                        <Badge variant="secondary">High Confidence</Badge>
                      </div>

                      <div className="rounded-lg border border-border p-4">
                        <h4 className="mb-2 font-semibold text-foreground">AI Analysis</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✓ Category: Electronics (Camera)</li>
                          <li>✓ Condition Score: 85/100</li>
                          <li>✓ Brand: Canon (Premium)</li>
                          <li>✓ Market Demand: High</li>
                        </ul>
                      </div>

                      <div className="rounded-lg border border-border p-4">
                        <h4 className="mb-2 font-semibold text-foreground">Suggested Description</h4>
                        <p className="text-sm text-muted-foreground">
                          "Vintage Canon AE-1 camera in excellent working condition. Classic 35mm SLR, perfect for film photography enthusiasts. Shows minimal signs of use with fully functional shutter and light meter."
                        </p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      Accept Suggestions
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Better Listings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Use clear, well-lit photos from multiple angles</p>
                <p>• Be honest about item condition</p>
                <p>• Include all relevant details and measurements</p>
                <p>• Highlight sustainable or eco-friendly features</p>
                <p>• Respond quickly to buyer questions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateListing;
