"use client"

import { Mail, Phone, MapPin, Anchor, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary text-primary-foreground py-16 px-4">
      <div className="w-full px-6 lg:px-12">

        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center">
                <Anchor className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-bold text-xl">Marassi Gulf</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              {t("footer.description")}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  {t("footer.home")}
                </a>
              </li>
              <li>
                <a href="/yachts" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  {t("footer.yachts")}
                </a>
              </li>
              <li>
                <a href="/#services" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  {t("features.title")}
                </a>
              </li>
              <li>
                <a href="/#testimonials" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  {t("footer.about")}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  {t("footer.helpCenter")}
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  {t("footer.terms")}
                </a>
              </li>
              <li>
                <a href="/support" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  {t("footer.contactUs")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("footer.contactInfo")}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium mb-1">{t("footer.email")}</div>
                  <a href="mailto:support@marassigulf.com" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {t("footer.support")}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium mb-1">{t("footer.phone")}</div>
                  <a href="tel:+966123456789" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    +966 12 345 6789
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium mb-1">{t("footer.contact")}</div>
                  <span className="text-primary-foreground/70">
                    {t("footer.address")}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            {t("footer.copyright")}
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
              {t("footer.terms")}
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
              {t("footer.refund")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}