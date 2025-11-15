import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Creating affiliate user...');

    // Create the user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'affli1@example.com',
      password: '1password',
      email_confirm: true,
      user_metadata: {
        name: 'Affiliate User'
      }
    });

    if (userError) {
      console.error('Error creating user:', userError);
      return new Response(
        JSON.stringify({ error: userError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User created:', userData.user.id);

    // Assign affiliate role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'affiliate'
      });

    if (roleError) {
      console.error('Error assigning role:', roleError);
      return new Response(
        JSON.stringify({ error: roleError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Affiliate role assigned');

    // Insert 10 sample listings
    const listings = [
      {
        user_id: userData.user.id,
        title: 'Vintage Leather Jacket',
        description: 'Classic brown leather jacket in excellent condition. Perfect for sustainable fashion lovers.',
        category: 'Fashion',
        condition: 'Like New',
        price_ecocoins: 2500,
        photos: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
        sustainability_impact: 'Buying second-hand reduces carbon footprint by 82%',
        status: 'active'
      },
      {
        user_id: userData.user.id,
        title: 'MacBook Pro 2019',
        description: '13-inch MacBook Pro with Touch Bar. 256GB SSD, 8GB RAM. Gently used.',
        category: 'Electronics',
        condition: 'Good',
        price_ecocoins: 4500,
        photos: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
        sustainability_impact: 'Extending device life saves 190kg of CO2 emissions',
        status: 'active'
      },
      {
        user_id: userData.user.id,
        title: 'Wooden Dining Table Set',
        description: 'Beautiful handcrafted oak dining table with 6 chairs. Perfect for eco-conscious homes.',
        category: 'Home',
        condition: 'Good',
        price_ecocoins: 3200,
        photos: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'],
        sustainability_impact: 'Reusing furniture prevents 500kg of landfill waste',
        status: 'active'
      },
      {
        user_id: userData.user.id,
        title: 'Nike Running Shoes',
        description: 'Size 10 Nike Air Zoom running shoes. Barely worn, excellent condition.',
        category: 'Sports',
        condition: 'Like New',
        price_ecocoins: 800,
        photos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        sustainability_impact: 'Second-hand sports gear reduces manufacturing emissions',
        status: 'active'
      },
      {
        user_id: userData.user.id,
        title: 'Canon EOS Camera Bundle',
        description: 'Canon EOS Rebel T7 with 18-55mm lens, battery, charger, and camera bag.',
        category: 'Electronics',
        condition: 'Good',
        price_ecocoins: 3500,
        photos: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800'],
        sustainability_impact: 'Reusing electronics saves rare earth minerals',
        status: 'active'
      },
      {
        user_id: userData.user.id,
        title: 'Designer Handbag Collection',
        description: 'Authentic Michael Kors handbag. Classic design, genuine leather.',
        category: 'Fashion',
        condition: 'Like New',
        price_ecocoins: 1800,
        photos: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'],
        sustainability_impact: 'Luxury resale reduces fast fashion impact',
        status: 'active'
      },
      {
        user_id: userData.user.id,
        title: 'Yoga Mat and Accessories',
        description: 'Premium yoga mat with blocks, strap, and carrying bag. Lightly used.',
        category: 'Sports',
        condition: 'Good',
        price_ecocoins: 600,
        photos: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
        sustainability_impact: 'Sustainable fitness choices reduce plastic waste',
        status: 'active'
      },
      {
        user_id: userData.user.id,
        title: 'Bookshelf - Modern Design',
        description: 'Contemporary 5-tier bookshelf in white. Sturdy and spacious.',
        category: 'Home',
        condition: 'Good',
        price_ecocoins: 1200,
        photos: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'],
        sustainability_impact: 'Furniture reuse prevents deforestation',
        status: 'active'
      },
      {
        user_id: userData.user.id,
        title: 'Mountain Bike - Trek',
        description: '21-speed mountain bike in great working condition. Recently serviced.',
        category: 'Sports',
        condition: 'Good',
        price_ecocoins: 2800,
        photos: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800'],
        sustainability_impact: 'Cycling reduces transport emissions by 67%',
        status: 'active'
      },
      {
        user_id: userData.user.id,
        title: 'Coffee Table - Industrial Style',
        description: 'Reclaimed wood coffee table with metal frame. Unique sustainable piece.',
        category: 'Home',
        condition: 'Like New',
        price_ecocoins: 1500,
        photos: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800'],
        sustainability_impact: 'Reclaimed furniture gives new life to materials',
        status: 'active'
      }
    ];

    const { error: listingsError } = await supabaseAdmin
      .from('listings')
      .insert(listings);

    if (listingsError) {
      console.error('Error creating listings:', listingsError);
      return new Response(
        JSON.stringify({ error: listingsError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('10 listings created successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Affiliate user created with 10 listings',
        user_id: userData.user.id,
        email: 'affli1@example.com'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
