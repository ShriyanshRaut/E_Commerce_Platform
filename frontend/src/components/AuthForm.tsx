import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";

interface Field {
  id: string;
  label: string;
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
}

interface Props {
  mode: "login" | "register";
}

const AuthForm = ({ mode }: Props) => {
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const fields: Field[] =
    mode === "login"
      ? [
          { id: "email", label: "Email", type: "email", icon: Mail, placeholder: "you@example.com" },
          { id: "password", label: "Password", type: "password", icon: Lock, placeholder: "••••••••" },
        ]
      : [
          { id: "name", label: "Full name", type: "text", icon: Sparkles, placeholder: "Jane Doe" },
          { id: "email", label: "Email", type: "email", icon: Mail, placeholder: "you@example.com" },
          { id: "password", label: "Password", type: "password", icon: Lock, placeholder: "••••••••" },
        ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(mode === "login" ? "Welcome back" : "Account created", {
        description: "Demo only — no backend connected.",
      });
    }, 900);
  };

  return (
    <PageTransition>
      <section className="container mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 rounded-3xl bg-gradient-glow opacity-50" />
            <div className="relative rounded-3xl border border-white/5 bg-gradient-card p-8 shadow-card backdrop-blur-xl">
              <div className="mb-8 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="mt-5 text-2xl font-semibold tracking-tight">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {mode === "login"
                    ? "Sign in to continue your journey"
                    : "Join the E·Shop community"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((f) => {
                  const Icon = f.icon;
                  const isFocused = focused === f.id;
                  return (
                    <div key={f.id}>
                      <label
                        htmlFor={f.id}
                        className="mb-1.5 block text-xs font-medium text-muted-foreground"
                      >
                        {f.label}
                      </label>
                      <div
                        className={`group relative flex items-center gap-3 rounded-2xl border bg-white/5 px-4 transition-all duration-300 ${
                          isFocused
                            ? "border-primary/60 bg-white/[0.07] shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
                            : "border-white/10"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isFocused ? "text-primary-glow" : "text-muted-foreground"
                          }`}
                        />
                        <input
                          id={f.id}
                          type={f.type}
                          required
                          placeholder={f.placeholder}
                          onFocus={() => setFocused(f.id)}
                          onBlur={() => setFocused(null)}
                          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                        />
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="mt-2 w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                  ) : (
                    <>
                      {mode === "login" ? "Sign in" : "Create account"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    New here?{" "}
                    <Link to="/register" className="text-foreground underline-offset-4 hover:underline">
                      Create an account
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link to="/login" className="text-foreground underline-offset-4 hover:underline">
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
};

export default AuthForm;
