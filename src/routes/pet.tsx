import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import petImg from "@/assets/pet.png";
import { Pencil, Sparkles, Backpack, Home as HomeIcon, School, TreePalm, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { usePet } from "@/lib/pet-store";
import { SHOP_ITEMS, useWardrobe, toggleEquip, type ShopItem } from "@/lib/wardrobe-store";

export const Route = createFileRoute("/pet")({
  head: () => ({
    meta: [
      { title: "豆豆 · 生活空间 & 背包" },
      { name: "description", content: "豆豆的家、学校、游乐场和背包。" },
    ],
  }),
  component: Pet,
});

const spaces = [
  { key: "家", icon: HomeIcon, bg: "oklch(0.92 0.05 60)" },
  { key: "学校", icon: School, bg: "oklch(0.9 0.06 230)" },
  { key: "游乐场", icon: TreePalm, bg: "oklch(0.9 0.08 145)" },
  { key: "自定义", icon: Plus, bg: "oklch(0.93 0.04 320)" },
] as const;

const bagTabs: ShopItem["category"][] = ["装扮", "家具", "颜色", "旅行"];

// Fixed positions for equipped items in the scene, indexed by equip order.
const SLOTS: React.CSSProperties[] = [
  { top: "10%", left: "8%" },
  { top: "12%", right: "8%" },
  { bottom: "18%", left: "6%" },
  { bottom: "8%", right: "6%" },
  { top: "35%", left: "12%" },
  { top: "38%", right: "14%" },
  { bottom: "40%", left: "40%" },
  { bottom: "45%", right: "38%" },
];

function Pet() {
  const pet = usePet();
  const wd = useWardrobe();
  const [view, setView] = useState<"space" | "bag">("space");
  const [space, setSpace] = useState<(typeof spaces)[number]["key"]>("家");
  const [bagTab, setBagTab] = useState<ShopItem["category"]>("装扮");

  const ownedItems = SHOP_ITEMS.filter((i) => wd.owned.includes(i.id));
  const bagList = ownedItems.filter((i) => i.category === bagTab);
  const equippedItems = SHOP_ITEMS.filter((i) => wd.equipped.includes(i.id));

  return (
    <AppShell bgClass="bg-gradient-to-b from-[oklch(0.9_0.06_60)] to-[oklch(0.96_0.04_80)]">
      <header className="flex items-center justify-between px-5 pt-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">My {pet.name}</p>
          <h1 className="mt-1 text-3xl">{pet.name} {pet.avatar || "🐣"}</h1>
        </div>
        <button onClick={() => setView("bag")} className="flex items-center gap-1 rounded-full bg-card px-3 py-2 text-sm font-bold shadow-sm">
          <Pencil className="h-4 w-4" /> 装扮
        </button>
      </header>

      <div className="mx-4 mt-4 flex rounded-full bg-card p-1 shadow-sm">
        {[
          { k: "space", label: "生活空间" },
          { k: "bag", label: `背包 · ${ownedItems.length}` },
        ].map((s) => (
          <button
            key={s.k}
            onClick={() => setView(s.k as "space" | "bag")}
            className={`flex-1 rounded-full py-2 text-sm font-bold transition-all ${
              view === s.k ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {view === "space" ? (
        <>
          <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {spaces.map((sp) => {
              const Icon = sp.icon;
              const active = sp.key === space;
              return (
                <button key={sp.key} onClick={() => setSpace(sp.key)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold ${active ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70"}`}>
                  <Icon className="h-4 w-4" />{sp.key}
                </button>
              );
            })}
          </div>

          <div className="mx-4 mt-3 overflow-hidden rounded-3xl shadow-inner" style={{ background: spaces.find((s) => s.key === space)!.bg }}>
            <div className="relative h-72 w-full">
              <div className="absolute inset-x-0 top-0 h-2/3 bg-[repeating-linear-gradient(45deg,_oklch(0.88_0.06_60_/_0.4)_0_10px,_transparent_10px_20px)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[oklch(0.8_0.08_50)]" />

              {/* Equipped items */}
              {equippedItems.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => toggleEquip(it.id)}
                  aria-label={`取下 ${it.name}`}
                  className="absolute text-4xl drop-shadow-md transition-transform active:scale-90"
                  style={SLOTS[i % SLOTS.length]}
                  title={`点击取下：${it.name}`}
                >
                  {it.emoji}
                </button>
              ))}

              {pet.avatarImage ? (
                <img src={pet.avatarImage} alt={pet.name} className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 object-contain" />
              ) : pet.avatar ? (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[6.5rem]">{pet.avatar}</div>
              ) : (
                <img src={petImg} alt="豆豆" width={768} height={768} className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2" />
              )}
            </div>
          </div>

          <div className="mx-4 mt-3 rounded-2xl bg-card/70 p-3 text-xs text-foreground/70">
            {equippedItems.length === 0
              ? <>还没有装饰哦，先去 <Link to="/shop" className="font-bold text-primary">商店</Link> 逛逛，然后在背包里点「穿上/放入」～</>
              : <>点击场景里的物品可以取下 · 已放入 {equippedItems.length} 件</>}
          </div>

          <section className="mt-4 px-4">
            <div className="card-pop flex items-center gap-3 bg-gradient-to-r from-[oklch(0.88_0.1_85)] to-[oklch(0.86_0.13_60)] p-4">
              <Sparkles className="h-7 w-7 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-bold">让朋友来串门</p>
                <p className="text-xs text-foreground/70">开启好友空间访问</p>
              </div>
              <button className="rounded-full bg-card px-3 py-1.5 text-sm font-bold">开启</button>
            </div>
          </section>
        </>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-2 px-5">
            <Backpack className="h-5 w-5 text-primary" />
            <h2 className="text-lg">{pet.name} 的背包</h2>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-3 text-sm">
            {bagTabs.map((t) => (
              <button key={t} onClick={() => setBagTab(t)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 font-bold ${bagTab === t ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="px-4 pb-6">
            {bagList.length === 0 ? (
              <div className="card-pop flex flex-col items-center gap-2 p-6 text-center">
                <ShoppingBag className="h-8 w-8 text-primary/60" />
                <p className="text-sm text-muted-foreground">背包里还没有「{bagTab}」</p>
                <Link to="/shop" className="mt-1 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">去商店逛逛</Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {bagList.map((i) => {
                  const on = wd.equipped.includes(i.id);
                  return (
                    <article key={i.id} className="card-pop relative flex flex-col items-center p-3">
                      <div className="flex h-16 w-full items-center justify-center rounded-xl bg-secondary text-3xl">{i.emoji}</div>
                      <p className="mt-1.5 text-center text-xs font-bold leading-tight">{i.name}</p>
                      <button
                        onClick={() => toggleEquip(i.id)}
                        className={`mt-1.5 w-full rounded-full py-1 text-[11px] font-bold active:scale-95 ${on ? "bg-secondary text-foreground/70" : "bg-primary text-primary-foreground"}`}
                      >
                        {on ? "取下" : "放入/穿上"}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}
