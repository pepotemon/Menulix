"use client";

import { KeyRound, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/components/admin/auth-provider";

function LoginForm(): JSX.Element {
  const router = useRouter();
  const { user, isLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/admin");
    }
  }, [isLoading, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch {
      setErrorMessage("Não foi possível entrar. Verifique e-mail e senha.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-10 text-ink">
      <section className="w-full max-w-md rounded-md border border-line bg-white p-6 shadow-soft">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-leaf">
            Menulix Admin
          </p>
          <h1 className="mt-2 text-2xl font-black">Entrar no painel</h1>
          <p className="mt-2 text-sm leading-6 text-ink/68">
            Acesse com o e-mail do restaurante para administrar o cardápio.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-ink">E-mail</span>
            <span className="mt-2 flex min-h-12 items-center gap-2 rounded-md border border-line bg-cream px-3 focus-within:border-leaf">
              <Mail size={18} className="text-ink/50" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink/50"
                placeholder="restaurante@email.com"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink">Senha</span>
            <span className="mt-2 flex min-h-12 items-center gap-2 rounded-md border border-line bg-cream px-3 focus-within:border-leaf">
              <KeyRound size={18} className="text-ink/50" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink/50"
                placeholder="Sua senha"
              />
            </span>
          </label>

          {errorMessage ? (
            <p className="rounded-md border border-tomato bg-cream px-3 py-2 text-sm font-semibold text-tomato">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="min-h-12 w-full rounded-md bg-leaf px-4 py-3 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function AdminLoginPage(): JSX.Element {
  return <LoginForm />;
}
