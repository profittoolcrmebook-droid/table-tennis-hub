import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { articles } from "@/data/demo";
import { ChevronLeft, Clock } from "lucide-react";
import { formatDateCL } from "@/lib/format";
import { Button } from "@/components/ui/button";

const ArticleDetail = () => {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug);
  if (!article) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-3xl py-24 text-center">
          <h1 className="font-display text-4xl italic">Artículo no encontrado</h1>
          <Button asChild variant="outline-brand" className="mt-6"><Link to="/guias">Volver a guías</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <SEO title={`${article.title} — PingPongHub`} description={article.excerpt} />
      <article className="container-px mx-auto max-w-3xl py-12">
        <Link to="/guias" className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-brand"><ChevronLeft className="size-3" /> Volver a guías</Link>

        <span className="inline-block rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-foreground">{article.category}</span>
        <h1 className="mt-4 font-display text-4xl italic leading-tight md:text-6xl">{article.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDateCL(article.date)}</span>
          <span className="flex items-center gap-1"><Clock className="size-3" /> {article.readTime}</span>
        </div>

        <img src={article.cover} alt={article.title} className="mt-8 aspect-[16/10] w-full rounded-2xl object-cover" width={1280} height={800} />

        <div className="prose prose-invert mt-8 max-w-none text-foreground/90">
          <p className="text-lg text-muted-foreground">{article.excerpt}</p>
          <p>Esta es una guía demo. En la próxima fase vamos a conectar el contenido editorial real desde el panel de administración, donde podrás escribir, editar y publicar artículos completos con imágenes, productos relacionados y SEO optimizado.</p>
          <h2 className="font-display italic text-3xl mt-10 mb-4">Por qué importa</h2>
          <p>El equipamiento correcto puede ser la diferencia entre un jugador estancado y uno que progresa rápido. Aquí explicamos cómo identificar tu estilo, qué priorizar y dónde no gastar de más.</p>
          <h2 className="font-display italic text-3xl mt-10 mb-4">Recomendaciones rápidas</h2>
          <ul>
            <li>Si buscas spin: gomas tacky tipo DHS Hurricane 3.</li>
            <li>Si buscas velocidad: tensores europeos tipo Tibhar MX-P o Andro R47.</li>
            <li>Si recién empiezas: paleta pre-armada o kit starter.</li>
          </ul>
        </div>
      </article>
    </SiteLayout>
  );
};

export default ArticleDetail;
