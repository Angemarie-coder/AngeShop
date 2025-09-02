// Paypack API Configuration and Token Management

export const PAYPACK_CONFIG = {
  CLIENT_ID: "c1597cea-85c9-11f0-b78a-deadd43720af",
  CLIENT_SECRET: "557e529d60704ce379e6bd7dc779e7bada39a3ee5e6b4b0d3255bfef95601890afd80709",
  BASE_URL: "https://payments.paypack.rw/api",
  ENDPOINTS: {
    AUTH: "/auth/agents/authorize",
    REFRESH: "/auth/agents/refresh",
    CASHIN: "/transactions/cashin",
    TRANSACTION_STATUS: "/transactions/find",
  },
};

interface TokenData {
  access: string;
  refresh: string;
  expires: number;
}

interface PaymentRequest {
  amount: number;
  phone: string;
}

interface PaymentResponse {
  success: boolean;
  data?: any;
  message?: string;
}

class PaypackTokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: Date | null = null;

  async getAccessToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.accessToken!;
    }

    if (this.refreshToken && !this.isTokenExpired()) {
      try {
        await this.refreshAccessToken();
        return this.accessToken!;
      } catch (error) {
        console.log("Refresh failed, getting new token...");
      }
    }

    return await this.requestNewToken();
  }

  private async requestNewToken(): Promise<string> {
    try {
      console.log("Getting new access token from Paypack...");

      const response = await fetch(
        `${PAYPACK_CONFIG.BASE_URL}${PAYPACK_CONFIG.ENDPOINTS.AUTH}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: PAYPACK_CONFIG.CLIENT_ID,
            client_secret: PAYPACK_CONFIG.CLIENT_SECRET,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status} - ${errorText}`);
      }

      const data: TokenData = await response.json();
      this.accessToken = data.access;
      this.refreshToken = data.refresh;
      this.tokenExpiry = new Date(data.expires * 1000);

      console.log("Access token obtained successfully");
      console.log("Token expires at:", this.tokenExpiry);
      
      return this.accessToken;
    } catch (error) {
      console.error("Error getting access token:", error);
      throw error;
    }
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      console.log("Refreshing access token...");

      const response = await fetch(
        `${PAYPACK_CONFIG.BASE_URL}${PAYPACK_CONFIG.ENDPOINTS.REFRESH}/${this.refreshToken}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
      }

      const data: TokenData = await response.json();
      this.accessToken = data.access;
      this.refreshToken = data.refresh;
      this.tokenExpiry = new Date(data.expires * 1000);

      console.log("Access token refreshed successfully");
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  private isTokenValid(): boolean {
    return this.accessToken !== null && !this.isTokenExpired();
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    const now = new Date();
    return now > this.tokenExpiry;
  }
}

// Export singleton instance
export const paypackTokenManager = new PaypackTokenManager();

// Utility functions for API calls
export async function processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  try {
    const accessToken = await paypackTokenManager.getAccessToken();

    const response = await fetch(
      `${PAYPACK_CONFIG.BASE_URL}${PAYPACK_CONFIG.ENDPOINTS.CASHIN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          number: paymentData.phone,
        }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return {
        success: false,
        message: result.message || "Payment failed",
        data: result,
      };
    }
  } catch (error) {
    console.error("Payment error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getTransactionStatus(ref: string): Promise<PaymentResponse> {
  try {
    const accessToken = await paypackTokenManager.getAccessToken();

    const response = await fetch(
      `${PAYPACK_CONFIG.BASE_URL}${PAYPACK_CONFIG.ENDPOINTS.TRANSACTION_STATUS}/${ref}`,
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
      return { success: true, data: result };
    } else {
      return {
        success: false,
        message: result.message || "Failed to get transaction",
        data: result,
      };
    }
  } catch (error) {
    console.error("Transaction status error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
