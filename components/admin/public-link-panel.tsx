"use client";

import QRCode from "qrcode";
import { Copy, ExternalLink, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Restaurant } from "@/types/menu";

interface PublicLinkPanelProps {
  restaurant: Restaurant;
}

export function PublicLinkPanel({
  restaurant
}: PublicLinkPanelProps): JSX.Element {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const publicPath = `/${restaurant.slug}`;

  useEffect(() => {
    const publicUrl = `${window.location.origin}${publicPath}`;
    QRCode.toDataURL(publicUrl, {
      margin: 2,
      width: 320,
      color: {
        dark: "#1E2528",
        light: "#FFF7EC"
      }
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [publicPath]);

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-md border border-line bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-black text-ink">Link do cardápio</h2>
          <p className="mt-1 text-sm leading-6 text-ink/68">
            Compartilhe este link com seus clientes ou use o QR Code no balcão.
          </p>
          <p className="mt-3 break-all rounded-md border border-line bg-cream px-3 py-2 text-sm font-bold text-ink">
            {publicPath}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-black text-ink transition hover:border-leaf hover:text-leaf"
          >
            <Copy size={18} />
            {copied ? "Copiado" : "Copiar link"}
          </button>
          <Link
            href={publicPath}
            target="_blank"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-leaf px-4 py-2 text-sm font-black text-white transition hover:bg-ink"
          >
            <ExternalLink size={18} />
            Ver cardápio
          </Link>
        </div>
      </div>

      {qrDataUrl ? (
        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center">
          <Image
            src={qrDataUrl}
            alt="QR Code do cardápio"
            width={128}
            height={128}
            unoptimized
            className="h-32 w-32 rounded-md border border-line bg-cream"
          />
          <a
            href={qrDataUrl}
            download={`qr-code-${restaurant.slug}.png`}
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-black text-ink transition hover:border-leaf hover:text-leaf"
          >
            <QrCode size={18} />
            Baixar QR Code
          </a>
        </div>
      ) : null}
    </section>
  );
}
