import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmDeliveryRequest {
  orderId: string;
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

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { orderId }: ConfirmDeliveryRequest = await req.json();

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    console.log('Confirming delivery for order:', orderId);

    // Get order details
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*, listings(title)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Verify user is the buyer
    if (order.buyer_id !== user.id) {
      throw new Error('Only the buyer can confirm delivery');
    }

    if (order.status === 'completed') {
      throw new Error('Order already completed');
    }

    if (order.status !== 'shipped') {
      throw new Error('Order must be shipped before confirming delivery');
    }

    // Get escrow
    const { data: escrow, error: escrowError } = await supabaseClient
      .from('escrow')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (escrowError || !escrow) {
      throw new Error('Escrow not found');
    }

    if (escrow.status !== 'held') {
      throw new Error('Escrow already released');
    }

    // Calculate affiliate commission (10%)
    const affiliateCommission = Math.floor(order.amount_ecocoins * 0.1);
    const sellerAmount = order.amount_ecocoins - (order.affiliate_link_id ? affiliateCommission : 0);

    // 1. Release escrow and credit seller
    const { data: sellerWallet } = await supabaseClient
      .from('wallets')
      .select('balance')
      .eq('user_id', order.seller_id)
      .single();

    if (!sellerWallet) {
      throw new Error('Seller wallet not found');
    }

    await supabaseClient
      .from('wallets')
      .update({ balance: sellerWallet.balance + sellerAmount })
      .eq('user_id', order.seller_id);

    // 2. Update escrow status
    await supabaseClient
      .from('escrow')
      .update({ status: 'released', released_at: new Date().toISOString() })
      .eq('order_id', orderId);

    // 3. Update order status
    await supabaseClient
      .from('orders')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', orderId);

    // 4. Record seller transaction
    await supabaseClient
      .from('transactions')
      .insert({
        user_id: order.seller_id,
        order_id: orderId,
        amount: sellerAmount,
        transaction_type: 'sale',
        description: `Sale: ${(order.listings as any)?.title || 'Item'}`,
      });

    // 5. Process affiliate commission if applicable
    if (order.affiliate_link_id) {
      const { data: affiliateLink } = await supabaseClient
        .from('affiliate_links')
        .select('affiliate_user_id')
        .eq('id', order.affiliate_link_id)
        .single();

      if (affiliateLink) {
        // Credit affiliate
        const { data: affiliateWallet } = await supabaseClient
          .from('wallets')
          .select('balance')
          .eq('user_id', affiliateLink.affiliate_user_id)
          .single();

        if (affiliateWallet) {
          await supabaseClient
            .from('wallets')
            .update({ balance: affiliateWallet.balance + affiliateCommission })
            .eq('user_id', affiliateLink.affiliate_user_id);

          // Record affiliate earning
          await supabaseClient
            .from('affiliate_earnings')
            .insert({
              affiliate_user_id: affiliateLink.affiliate_user_id,
              listing_id: order.listing_id,
              affiliate_link_id: order.affiliate_link_id,
              ecocoins_earned: affiliateCommission,
            });

          // Record affiliate transaction
          await supabaseClient
            .from('transactions')
            .insert({
              user_id: affiliateLink.affiliate_user_id,
              order_id: orderId,
              amount: affiliateCommission,
              transaction_type: 'commission',
              description: `Affiliate commission: ${(order.listings as any)?.title || 'Item'}`,
            });

          console.log('Affiliate commission processed:', affiliateCommission, 'EcoCoins');
        }
      }
    }

    console.log('Delivery confirmed successfully for order:', orderId);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Delivery confirmed and payment released',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error confirming delivery:', error);
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
