import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if your backend is accessible
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${backendUrl}/products`);
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: `Backend responded with status: ${response.status}`,
        backendUrl,
        error: 'Backend connection failed'
      }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Backend connection successful',
      backendUrl,
      data: data,
      dataType: typeof data,
      hasProducts: 'products' in data,
      productCount: data.products ? data.products.length : 'No products array found'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to backend',
      backendUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

