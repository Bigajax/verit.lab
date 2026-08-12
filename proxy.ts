import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Protege /admin/*: sem sessão válida, vai para /admin/login.
// Também renova o token do Supabase a cada request (padrão @supabase/ssr).
export async function proxy(request: NextRequest) {
  // Modo demonstração (sem Supabase configurado): o admin abre sem senha,
  // com dados de exemplo; o login não existe ainda.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([chave, valor]) =>
            response.headers.set(chave, valor),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ehLogin = request.nextUrl.pathname === "/admin/login";
  if (!user && !ehLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (user && ehLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: "/admin/:path*",
};
