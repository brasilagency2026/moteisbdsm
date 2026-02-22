import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// GET - Fetch motels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const ownerId = searchParams.get('ownerId');

    let motels;

    if (status) {
      motels = await convex.query('motels:getByStatus', { status });
    } else if (ownerId) {
      motels = await convex.query('motels:getByOwner', { ownerId });
    } else {
      motels = await convex.query('motels:getAll');
    }

    return NextResponse.json({
      success: true,
      motels,
    });
  } catch (error: any) {
    console.error('Error fetching motels:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao buscar motéis',
    }, { status: 500 });
  }
}

// POST - Create motel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const motel = await convex.mutation('motels:create', {
      ownerId: body.ownerId,
      name: body.name,
      description: body.description,
      location: body.location,
      state: body.state,
      city: body.city,
      address: body.address,
      phone: body.phone,
      whatsapp: body.whatsapp,
      tripadvisor: body.tripadvisor,
      email: body.email,
      latitude: body.latitude,
      longitude: body.longitude,
      images: body.images,
      mainImage: body.mainImage,
      features: body.features,
      hours: body.hours,
      periods: body.periods,
      isPremium: body.isPremium || false,
    });

    return NextResponse.json({
      success: true,
      motelId: motel,
    });
  } catch (error: any) {
    console.error('Error creating motel:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao criar motel',
    }, { status: 500 });
  }
}

// PATCH - Update motel
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    await convex.mutation('motels:update', {
      id: body.id,
      name: body.name,
      description: body.description,
      location: body.location,
      state: body.state,
      city: body.city,
      address: body.address,
      phone: body.phone,
      whatsapp: body.whatsapp,
      tripadvisor: body.tripadvisor,
      email: body.email,
      latitude: body.latitude,
      longitude: body.longitude,
      images: body.images,
      mainImage: body.mainImage,
      features: body.features,
      hours: body.hours,
      periods: body.periods,
      isPremium: body.isPremium,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating motel:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao atualizar motel',
    }, { status: 500 });
  }
}

// DELETE - Delete motel
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID do motel não fornecido',
      }, { status: 400 });
    }

    await convex.mutation('motels:remove', { id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting motel:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao excluir motel',
    }, { status: 500 });
  }
}
