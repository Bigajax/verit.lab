import { site } from "@/data/site.config";
import { waGeral } from "@/lib/whatsapp";

// Footer compartilhado — idêntico ao da home.
export default function SiteFooter() {
  return (
    <footer className="border-t border-ouro/25">
      {/* pb extra no mobile: a sticky bar nunca cobre os links do rodapé */}
      <div className="flex flex-wrap items-end justify-between gap-8 px-5 pt-14 pb-[calc(3.5rem+env(safe-area-inset-bottom)+1.5rem)] sm:px-12 lg:px-20 lg:pb-14">
        <div>
          <p className="font-display text-4xl italic">vérít.lab</p>
          <p className="font-marker mt-2 -rotate-1 text-xl text-rosa">
            nothing repeat.
          </p>
          <p className="eyebrow mt-3 text-osso/55">{site.cidade} · PR</p>
        </div>
        <nav className="flex gap-8">
          {/* o @ vive aqui (e na seção do laboratório, na home) */}
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-sm text-osso/70 hover:text-ambar"
          >
            {site.instagramHandle}
          </a>
          <a
            href={waGeral()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-sm text-osso/70 hover:text-ambar"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </footer>
  );
}
