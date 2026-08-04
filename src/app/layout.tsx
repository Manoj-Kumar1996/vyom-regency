import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/components/AuthProvider";
import GlobalWhatsAppButton from "@/components/GlobalWhatsAppButton";
import SocialSidebar from "@/components/SocialSidebar";
import { Toaster } from "@/components/ui/sonner";
import JsonLd from "@/components/JsonLd";
import { getGlobalSettings } from "@/lib/seo";
import { organizationSchema, websiteSchema, mergeCustomJsonLd } from "@/lib/schema";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 0.8,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  return {
    title: "Vyom Regency Pvt Ltd - Premium Farmhouse Plots in Rajasthan",
    description: "Vyom Regency offers premium agriculture land and farmhouse plots in Kishangarh Bas, Alwar, Rajasthan. Clear titles, transparent deals since 2017.",
    verification: settings?.gsc_verification_code ? { google: settings.gsc_verification_code } : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getGlobalSettings();
  const jsonLd = mergeCustomJsonLd(
    [organizationSchema(settings), websiteSchema(settings)],
    settings?.custom_json_ld_global
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {settings?.ga4_measurement_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga4_measurement_id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.ga4_measurement_id}');`}
            </Script>
          </>
        )}
        {settings?.gtm_container_id && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.gtm_container_id}');`}
          </Script>
        )}
        {settings?.meta_pixel_id && (
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${settings.meta_pixel_id}');fbq('track', 'PageView');`}
          </Script>
        )}
        {settings?.header_scripts && (
          <div dangerouslySetInnerHTML={{ __html: settings.header_scripts }} suppressHydrationWarning />
        )}
      </head>
      <body className="antialiased min-w-[320px]" suppressHydrationWarning>
        {settings?.gtm_container_id && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.gtm_container_id}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <JsonLd data={jsonLd} />
        <AuthProvider>{children}</AuthProvider>
        <GlobalWhatsAppButton />
        <SocialSidebar />
        <Toaster richColors position="top-center" />
        {settings?.footer_scripts && (
          <div dangerouslySetInnerHTML={{ __html: settings.footer_scripts }} suppressHydrationWarning />
        )}
        <SpeedInsights />
      </body>
    </html>
  );
}
