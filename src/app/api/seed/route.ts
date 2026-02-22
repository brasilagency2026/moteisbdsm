import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Seed super admin - run once
export async function POST() {
  try {
    const result = await convex.mutation(api.motels.seedSuperAdmin);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error seeding:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao criar super admin',
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await convex.mutation(api.motels.seedSuperAdmin);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error seeding:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao criar super admin',
    }, { status: 500 });
  }
}
