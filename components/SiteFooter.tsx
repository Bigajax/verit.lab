import Image from "next/image";
import { site } from "@/data/site.config";
import logo from "@/public/marca/logo.png";
import { waGeral } from "@/lib/whatsapp";

// Footer compartilhado — idêntico ao da home.
export default function SiteFooter() {
  return (
    <footer className="border-t border-cinza/25">
      <div className="flex flex-wrap items-end justify-between gap-8 px-5 pt-14 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:px-12 lg:px-20 lg:pb-14">
        <div>
          <Image src={logo} alt="vérít.lab" className="h-14 w-auto" />
          <p className="font-marker mt-2 -rotate-1 text-xl text-magenta">
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
            className="inline-flex min-h-11 items-center text-sm text-osso/70 hover:text-ciano"
          >
            {site.instagramHandle}
          </a>
          <a
            href={waGeral()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-sm text-osso/70 hover:text-ciano"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </footer>
  );
}
