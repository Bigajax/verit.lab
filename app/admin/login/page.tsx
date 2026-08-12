"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

// Login do painel — um único usuário, criado à mão no Supabase.
// Sem cadastro público, sem recuperação de senha.
export default function LoginAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function entrar(ev: React.FormEvent) {
    ev.preventDefault();
    setErro("");
    setEntrando(true);
    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) {
      setErro("Email ou senha incorretos.");
      setEntrando(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <form onSubmit={entrar} className="w-full max-w-sm border border-ouro/30 bg-osso/[0.02]">
        <div className="flex items-center justify-between gap-4 border-b border-ouro/30 px-6 py-4">
          <p className="font-display text-xl italic">vérít.lab</p>
          <p className="eyebrow">painel</p>
        </div>
        <div className="grid gap-5 p-6">
          <label className="grid gap-2">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              className="campo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="eyebrow">Senha</span>
            <input
              type="password"
              className="campo"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {erro && (
            <p role="alert" className="text-sm font-semibold text-rosa">
              {erro}
            </p>
          )}
          <button type="submit" className="btn-ambar w-full" disabled={entrando}>
            {entrando ? "Entrando…" : "Entrar"}
          </button>
        </div>
      </form>
    </main>
  );
}
