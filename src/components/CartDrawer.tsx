import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatCLP } from "@/lib/format";

export const CartDrawer = () => {
  const { items, isOpen, close, setQty, remove, subtotal, count } = useCart();
  const SHIPPING = subtotal >= 50000 ? 0 : items.length === 0 ? 0 : 4990;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-display text-2xl italic">CARRITO ({count})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="size-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
            <Button asChild variant="outline-brand" size="sm" onClick={close}>
              <Link to="/equipamiento">Explorar catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                  <img src={item.image} alt={item.name} className="size-20 rounded-md object-cover" loading="lazy" />
                  <div className="flex flex-1 flex-col">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.brand}</p>
                    <p className="font-medium text-sm leading-tight line-clamp-2">{item.name}</p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-1 rounded-md border border-border">
                        <button aria-label="Disminuir" className="px-2 py-1 hover:bg-secondary" onClick={() => setQty(item.id, item.quantity - 1)}><Minus className="size-3" /></button>
                        <span className="min-w-6 text-center text-sm font-bebas">{item.quantity}</span>
                        <button aria-label="Aumentar" className="px-2 py-1 hover:bg-secondary" onClick={() => setQty(item.id, item.quantity + 1)}><Plus className="size-3" /></button>
                      </div>
                      <p className="font-display text-base italic">{formatCLP(item.price * item.quantity)}</p>
                    </div>
                  </div>
                  <button aria-label="Eliminar" onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                </div>
              ))}
            </div>

            <SheetFooter className="border-t border-border pt-4 flex-col gap-3 sm:flex-col sm:space-x-0">
              <div className="w-full space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCLP(subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Envío estimado</span><span>{SHIPPING === 0 ? "GRATIS" : formatCLP(SHIPPING)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-display text-xl italic"><span>TOTAL</span><span className="text-brand">{formatCLP(subtotal + SHIPPING)}</span></div>
                {subtotal < 50000 && <p className="text-[10px] text-muted-foreground">Envío gratis sobre {formatCLP(50000)}</p>}
              </div>
              <Button asChild variant="hero" className="w-full" onClick={close}>
                <Link to="/checkout">Ir a pagar</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
