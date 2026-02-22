import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name, role } = body;

    if (action === 'login') {
      // Login
      try {
        const user = await convex.mutation(api.auth.login, {
          email,
          password,
        });

        // Create response with user data
        const response = NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        });

        // Set a simple session cookie (in production, use JWT or proper session management)
        response.cookies.set('session', JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: error.message || 'Erro ao fazer login',
        }, { status: 401 });
      }
    }

    if (action === 'register') {
      // Register new user
      try {
        const userId = await convex.mutation(api.auth.createUser, {
          email,
          password,
          name: name || email.split('@')[0],
          role: role || 'owner',
        });

        return NextResponse.json({
          success: true,
          userId,
        });
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: error.message || 'Erro ao criar usuário',
        }, { status: 400 });
      }
    }

    if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.delete('session');
      return response;
    }

    if (action === 'check') {
      const session = request.cookies.get('session');
      if (session) {
        try {
          const userData = JSON.parse(session.value);
          return NextResponse.json({
            success: true,
            user: userData,
          });
        } catch {
          return NextResponse.json({
            success: false,
            user: null,
          });
        }
      }
      return NextResponse.json({
        success: false,
        user: null,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Ação inválida',
    }, { status: 400 });

  } catch (error: any) {
    console.error('Auth API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Check session
  const session = request.cookies.get('session');
  if (session) {
    try {
      const userData = JSON.parse(session.value);
      return NextResponse.json({
        success: true,
        user: userData,
      });
    } catch {
      return NextResponse.json({
        success: false,
        user: null,
      });
    }
  }
  return NextResponse.json({
    success: false,
    user: null,
  });
}
