import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = "c1597cea-85c9-11f0-b78a-deadd43720af";
const CLIENT_SECRET = "557e529d60704ce379e6bd7dc779e7bada39a3ee5e6b4b0d3255bfef95601890afd80709";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiry: Date | null = null;

// Function to get access token from Paypack
async function getAccessToken() {
  try {
    console.log("Getting access token from Paypack...");

    const response = await fetch(
      "https://payments.paypack.rw/api/auth/agents/authorize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      }
    );

    console.log("Auth response status:", response.status);
    const responseText = await response.text();
    console.log("Auth response text:", responseText);

    if (response.ok) {
      const data = JSON.parse(responseText);
      accessToken = data.access;
      refreshToken = data.refresh;
      tokenExpiry = new Date(data.expires * 1000);
      console.log("Access token obtained successfully");
      console.log("Token expires at:", tokenExpiry);
      return accessToken;
    } else {
      throw new Error(
        `Authentication failed: ${response.status} - ${responseText}`
      );
    }
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

// Function to refresh access token
async function refreshAccessToken() {
  try {
    console.log("Refreshing access token...");
    console.log(
      "Current refresh token:",
      refreshToken ? refreshToken.substring(0, 20) + "..." : "None"
    );

    const response = await fetch(
      `https://payments.paypack.rw/api/auth/agents/refresh/${refreshToken}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    console.log("Refresh response status:", response.status);
    const responseText = await response.text();
    console.log("Refresh response:", responseText);

    if (response.ok) {
      const data = JSON.parse(responseText);
      accessToken = data.access;
      refreshToken = data.refresh;
      tokenExpiry = new Date(data.expires * 1000);
      console.log("Access token refreshed successfully");
      console.log("New token expiry:", tokenExpiry);
      return accessToken;
    } else {
      throw new Error(
        `Token refresh failed: ${response.status} - ${responseText}`
      );
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

function isTokenExpired() {
  if (!tokenExpiry) return true;
  const now = new Date();
  const expiry = new Date(tokenExpiry);
  return now > expiry;
}

export async function POST(request: NextRequest) {
  try {
    if (!accessToken) {
      console.log("No access token, getting new one...");
      await getAccessToken();
    } else if (isTokenExpired()) {
      console.log("Token expired, refreshing...");
      try {
        await refreshAccessToken();
      } catch (refreshError) {
        console.log("Refresh failed, getting new token...");
        await getAccessToken();
      }
    }

    const { amount, phone, orderId, items } = await request.json();
    console.log(`Processing cashin payment: Amount=${amount}, Phone=${phone}, OrderId=${orderId}`);

    const response = await fetch(
      "https://payments.paypack.rw/api/transactions/cashin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: parseInt(amount),
          number: phone,
        }),
      }
    );

    console.log("Payment response status:", response.status);
    const responseText = await response.text();
    console.log("Payment response text:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Payment response JSON parse error:", parseError);
      throw new Error(
        `Invalid payment response: ${responseText.substring(0, 100)}...`
      );
    }

    if (response.ok) {
      // Here you would typically save the order to your database
      // with the payment reference and status
      return NextResponse.json({ 
        success: true, 
        data: result,
        message: "Payment request sent successfully"
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message || "Payment failed",
        data: result,
      });
    }
  } catch (error: any) {
    console.error("Payment error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ 
        success: false, 
        message: "Transaction reference is required" 
      }, { status: 400 });
    }

    // Check if we need to get or refresh the access token
    if (!accessToken) {
      console.log("No access token, getting new one...");
      await getAccessToken();
    } else if (isTokenExpired()) {
      console.log("Token expired, refreshing...");
      try {
        await refreshAccessToken();
      } catch (refreshError) {
        console.log("Refresh failed, getting new token...");
        await getAccessToken();
      }
    }

    console.log(`Checking transaction status for ref: ${ref}`);

    const response = await fetch(
      `https://payments.paypack.rw/api/transactions/find/${ref}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Transaction status response:", response.status);
    const responseText = await response.text();
    console.log("Transaction response text:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Transaction response JSON parse error:", parseError);
      throw new Error(
        `Invalid transaction response: ${responseText.substring(0, 100)}...`
      );
    }

    if (response.ok) {
      return NextResponse.json({ success: true, data: result });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message || "Failed to get transaction",
        data: result,
      });
    }
  } catch (error: any) {
    console.error("Transaction status error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}
