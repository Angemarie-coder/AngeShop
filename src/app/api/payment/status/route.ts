import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = "c1597cea-85c9-11f0-b78a-deadd43720af";
const CLIENT_SECRET = "557e529d60704ce379e6bd7dc779e7bada39a3ee5e6b4b0d3255bfef95601890afd80709";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiry: Date | null = null;

// Function to get access token from Paypack
async function getAccessToken() {
  try {
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

    if (response.ok) {
      const data = await response.json();
      accessToken = data.access;
      refreshToken = data.refresh;
      tokenExpiry = new Date(data.expires * 1000);
      return accessToken;
    } else {
      throw new Error(`Authentication failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

// Function to refresh access token
async function refreshAccessToken() {
  try {
    const response = await fetch(
      `https://payments.paypack.rw/api/auth/agents/refresh/${refreshToken}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      accessToken = data.access;
      refreshToken = data.refresh;
      tokenExpiry = new Date(data.expires * 1000);
      return accessToken;
    } else {
      throw new Error(`Token refresh failed: ${response.status}`);
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
      await getAccessToken();
    } else if (isTokenExpired()) {
      try {
        await refreshAccessToken();
      } catch (refreshError) {
        await getAccessToken();
      }
    }

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

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        data: result,
        status: result.status || 'unknown'
      });
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
