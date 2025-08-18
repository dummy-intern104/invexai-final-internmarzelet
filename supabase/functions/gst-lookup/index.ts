
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gstNumber } = await req.json();
    
    if (!gstNumber) {
      return new Response(
        JSON.stringify({ error: 'GST number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate GST number format (15 characters, alphanumeric)
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(gstNumber)) {
      return new Response(
        JSON.stringify({ error: 'Invalid GST number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Make API call to GST verification service
    const apiKey = "BS2aHisGdiTRsuJAgfwspH4JTfG3";
    const apiUrl = `https://api.mastergst.com/einvoice/public/search?gstin=${gstNumber}`;
    
    console.log('Making GST API call for:', gstNumber);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'client_id': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('GST API error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch GST details' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('GST API response:', data);

    // Transform the response to match our expected format
    const gstDetails = {
      gstNumber: gstNumber,
      companyName: data.lgnm || data.tradeNam || '',
      address: data.pradr?.addr?.bno ? 
        `${data.pradr.addr.bno} ${data.pradr.addr.st || ''} ${data.pradr.addr.loc || ''}`.trim() : 
        data.pradr?.addr?.st || '',
      city: data.pradr?.addr?.dst || '',
      state: data.pradr?.addr?.stcd || '',
      pincode: data.pradr?.addr?.pncd || '',
      registrationDate: data.rgdt || '',
      businessType: data.ctb || '',
      stateCode: data.pradr?.addr?.stcd || ''
    };

    return new Response(
      JSON.stringify(gstDetails),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in GST lookup function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
