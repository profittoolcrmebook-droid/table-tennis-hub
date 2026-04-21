import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Flame, Upload as UploadIcon } from "lucide-react";

const SOCIAL_PATTERNS: Record<string, RegExp> = {
  instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|reels|tv)\/[\w-]+/i,
  tiktok: /^(https?:\/\/)?(www\.|vm\.|vt\.)?tiktok\.com\/(@[\w.-]+\/video\/\d+|[\w-]+)/i,
  youtube: /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/i,
  x: /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\/[\w]+\/status\/\d+/i,
};

const schema = z.object({
  first_name: z.string().trim().min(2, "Mínimo 2 caracteres").max(50),
  last_name: z.string().trim().min(2, "Mínimo 2 caracteres").max(50),
  city: z.string().trim().min(2, "Indica tu ciudad").max(80),
  social_network: z.enum(["instagram", "tiktok", "youtube", "x"], { required_error: "Elige una red" }),
  social_handle: z.string().trim().min(2, "Tu @usuario").max(50).regex(/^@?[\w.-]+$/, "Handle inválido"),
  video_url: z.string().trim().url("URL inválida").max(500),
  title: z.string().trim().min(4, "Mínimo 4 caracteres").max(100),
  description: z.string().trim().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
}).refine((d) => SOCIAL_PATTERNS[d.social_network].test(d.video_url), {
  message: "La URL no coincide con la red social seleccionada",
  path: ["video_url"],
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadClipModal = ({ open, onOpenChange }: Props) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "", last_name: "", city: "",
      social_network: undefined as unknown as FormValues["social_network"],
      social_handle: "", video_url: "", title: "", description: "",
    },
  });

  useEffect(() => {
    if (!open) form.reset();
  }, [open]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    setSubmitting(true);
    const handle = values.social_handle.startsWith("@") ? values.social_handle : `@${values.social_handle}`;
    const { error } = await supabase.from("clips").insert({
      user_id: user.id,
      title: values.title,
      player_handle: handle,
      first_name: values.first_name,
      last_name: values.last_name,
      city: values.city,
      social_network: values.social_network,
      social_handle: handle,
      video_url: values.video_url,
      description: values.description || null,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error al enviar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "¡Jugada enviada! 🔥", description: "Tu clip está en revisión. Te avisamos cuando se publique." });
    onOpenChange(false);
    navigate("/arena", { replace: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl italic flex items-center gap-2">
            <Flame className="size-6 text-brand fill-brand" /> SUBIR JUGADA
          </DialogTitle>
          <DialogDescription>
            Pega el link de tu video desde Instagram, TikTok, YouTube o X. Lo revisamos y publicamos en la Arena.
          </DialogDescription>
        </DialogHeader>

        {!loading && !user ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Necesitas iniciar sesión para subir tu jugada.</p>
            <Button asChild variant="hero" className="w-full">
              <Link to="/auth">Iniciar sesión</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">Nombre</Label>
                <Input id="first_name" {...form.register("first_name")} />
                {form.formState.errors.first_name && <p className="text-xs text-destructive">{form.formState.errors.first_name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Apellido</Label>
                <Input id="last_name" {...form.register("last_name")} />
                {form.formState.errors.last_name && <p className="text-xs text-destructive">{form.formState.errors.last_name.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" placeholder="Santiago, Valparaíso..." {...form.register("city")} />
              {form.formState.errors.city && <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Red social</Label>
                <Select
                  value={form.watch("social_network")}
                  onValueChange={(v) => form.setValue("social_network", v as FormValues["social_network"], { shouldValidate: true })}
                >
                  <SelectTrigger><SelectValue placeholder="Elige una" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="x">X (Twitter)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.social_network && <p className="text-xs text-destructive">{form.formState.errors.social_network.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="social_handle">Tu @usuario</Label>
                <Input id="social_handle" placeholder="@nombre" {...form.register("social_handle")} />
                {form.formState.errors.social_handle && <p className="text-xs text-destructive">{form.formState.errors.social_handle.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="video_url">URL del video</Label>
              <Input id="video_url" placeholder="https://..." {...form.register("video_url")} />
              {form.formState.errors.video_url && <p className="text-xs text-destructive">{form.formState.errors.video_url.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title">Título de la jugada</Label>
              <Input id="title" placeholder="Contraataque de revés en final regional" {...form.register("title")} />
              {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descripción corta (opcional)</Label>
              <Textarea id="description" rows={3} maxLength={200} placeholder="Cuéntanos el contexto en 1-2 líneas..." {...form.register("description")} />
              {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
              <UploadIcon className="size-4" /> {submitting ? "Enviando..." : "Enviar jugada"}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground">
              Tu clip será revisado antes de publicarse en la Arena.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
