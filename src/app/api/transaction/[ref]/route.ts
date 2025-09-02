import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStatus } from '@/lib/paypack';

export async function GET(
  request: NextRequest,
  { params }: { params: { ref: string } }
) {
  try {
    const { ref } = params;
    console.log(`Checking transaction status for ref: ${ref}`);

    const result = await getTransactionStatus(ref);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Transaction status error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
