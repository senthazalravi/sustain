import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PurchaseRequest {
  listingId: string;
  affiliateLinkCode?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { listingId, affiliateLinkCode }: PurchaseRequest = await req.json();

    // Validate input
    if (!listingId) {
      throw new Error('Listing ID is required');
    }

    console.log('Processing purchase for listing:', listingId, 'by user:', user.id);

    // Get listing details
    const { data: listing, error: listingError } = await supabaseClient
      .from('listings')
      .select('id, user_id, price_ecocoins, status, title')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      throw new Error('Listing not found');
    }

    if (listing.status !== 'active') {
      throw new Error('Listing is not available for purchase');
    }

    if (listing.user_id === user.id) {
      throw new Error('You cannot purchase your own listing');
    }

    // Get buyer's wallet
    const { data: buyerWallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (walletError || !buyerWallet) {
      throw new Error('Wallet not found');
    }

    if (buyerWallet.balance < listing.price_ecocoins) {
      throw new Error('Insufficient EcoCoins balance');
    }

    // Check if affiliate link exists
    let affiliateLinkId = null;
    if (affiliateLinkCode) {
      const { data: affiliateLink } = await supabaseClient
        .from('affiliate_links')
        .select('id, affiliate_user_id')
        .eq('link_code', affiliateLinkCode)
        .eq('listing_id', listingId)
        .single();

      if (affiliateLink && affiliateLink.affiliate_user_id !== user.id) {
        affiliateLinkId = affiliateLink.id;

        // Record affiliate click
        await supabaseClient
          .from('affiliate_clicks')
          .insert({
            affiliate_link_id: affiliateLink.id,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          });
      }
    }

    // Start transaction-like operations
    // 1. Deduct EcoCoins from buyer
    const { error: deductError } = await supabaseClient
      .from('wallets')
      .update({ balance: buyerWallet.balance - listing.price_ecocoins })
      .eq('user_id', user.id);

    if (deductError) {
      throw new Error('Failed to deduct EcoCoins from buyer');
    }

    // 2. Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        buyer_id: user.id,
        seller_id: listing.user_id,
        listing_id: listingId,
        amount_ecocoins: listing.price_ecocoins,
        status: 'pending',
        affiliate_link_id: affiliateLinkId,
      })
      .select()
      .single();

    if (orderError || !order) {
      // Rollback: refund buyer
      await supabaseClient
        .from('wallets')
        .update({ balance: buyerWallet.balance })
        .eq('user_id', user.id);
      throw new Error('Failed to create order');
    }

    // 3. Create escrow
    const { error: escrowError } = await supabaseClient
      .from('escrow')
      .insert({
        order_id: order.id,
        amount: listing.price_ecocoins,
        status: 'held',
      });

    if (escrowError) {
      // Rollback: delete order and refund buyer
      await supabaseClient.from('orders').delete().eq('id', order.id);
      await supabaseClient
        .from('wallets')
        .update({ balance: buyerWallet.balance })
        .eq('user_id', user.id);
      throw new Error('Failed to create escrow');
    }

    // 4. Record transaction
    await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        order_id: order.id,
        amount: -listing.price_ecocoins,
        transaction_type: 'purchase',
        description: `Purchased: ${listing.title}`,
      });

    // 5. Update listing status to sold
    await supabaseClient
      .from('listings')
      .update({ status: 'sold' })
      .eq('id', listingId);

    console.log('Purchase completed successfully. Order ID:', order.id);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        message: 'Purchase completed successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
