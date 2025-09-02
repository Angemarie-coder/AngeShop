import { NextRequest, NextResponse } from 'next/server';
import { processPayment } from '@/lib/paypack';

export async function POST(request: NextRequest) {
  try {
    const { amount, phone } = await request.json();
    console.log(`Processing cashin payment: Amount=${amount}, Phone=${phone}`);

    const result = await processPayment({
      amount: parseInt(amount),
      phone: phone
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
