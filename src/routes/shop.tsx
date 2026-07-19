import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Check } from "lucide-react";
import { useState } from "react";
import { SHOP_ITEMS, useWardrobe, buyItem, type ShopItem } from "@/lib/wardrobe-store";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "商店 · 豆豆星球" }, { name: "description", content: "用能量币给豆豆换装、布置小窝。" }] }),
  component: Shop,
});

const cats: ShopItem["category"][] = ["装扮", "家具", "颜色", "旅行"];
const catEmoji: Record<ShopItem["category"], string> = { 装扮: "✨", 家具: "🪑", 颜色: "🎨", 旅行: "🚀" };

function Shop() {
  const wd = useWardrobe();
  const [cat, setCat] = useState<ShopItem["category"]>("装扮");
  const [toast, setToast] = useState<string | null>(null);
  const items = SHOP_ITEMS.filter((i) => i.category === cat);

  const handleBuy = (id: string) => {
    const r = buyItem(id);
    setToast(r.ok ? "已放入背包 · 去豆豆家穿戴 ✨" : r.msg ?? "购买失败");
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <AppShell bgClass="bg-[oklch(0.96_0.04_85)]">
      <header className="px-5 pb-3 pt-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Shop</p>
            <h1 className="mt-1 text-3xl">豆豆商店 🛍️</h1>
          </div>
          <div className="pill flex items-center gap-1 bg-card">
            <Sparkles className="h-4 w-4 text-primary" /> {wd.coins}
          </div>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-5 pb-4 text-sm">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`whitespace-nowrap rounded-full px-4 py-2 font-bold shadow-sm ${c === cat ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
          >
            {catEmoji[c]} {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        {items.map((it) => {
          const owned = wd.owned.includes(it.id);
          return (
            <article key={it.id} className="card-pop relative flex flex-col items-center p-4">
              {it.tag && (
                <span className="absolute left-2 top-2 rounded-full bg-berry px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{it.tag}</span>
              )}
              <div className="flex h-24 w-full items-center justify-center rounded-xl bg-secondary text-5xl">{it.emoji}</div>
              <h3 className="mt-2 text-base">{it.name}</h3>
              <button
                onClick={() => !owned && handleBuy(it.id)}
                disabled={owned}
                className={`mt-2 flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-bold shadow-sm active:scale-95 ${
                  owned ? "bg-secondary text-foreground/70" : "bg-primary text-primary-foreground"
                }`}
              >
                {owned ? <><Check className="h-3.5 w-3.5" /> 已拥有</> : <><Sparkles className="h-3.5 w-3.5" /> {it.price}</>}
              </button>
            </article>
          );
        })}
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6">
          <div className="rounded-full bg-foreground/90 px-5 py-2.5 text-sm font-bold text-background shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </AppShell>
  );
}
