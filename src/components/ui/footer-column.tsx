import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const data = {
  facebookLink: 'https://facebook.com/aurex',
  instaLink: 'https://instagram.com/aurex',
  twitterLink: 'https://twitter.com/aurex',
  githubLink: 'https://github.com/aurex',
  dribbbleLink: 'https://dribbble.com/aurex',
  services: {
    cameras: '/#specs',
    lenses: '/#accessories',
    accessories: '/#accessories',
    support: '/#contact',
  },
  about: {
    history: '#',
    team: '#',
    handbook: '#',
    careers: '#',
  },
  help: {
    faqs: '#',
    support: '#',
    livechat: '#',
  },
  contact: {
    email: 'hello@aurex.com',
    phone: '+1 (800) AUREX-01',
    address: 'San Francisco, California, USA',
  },
  company: {
    name: 'AUREX',
    description:
      'Pioneering the future of optical engineering and digital capture technologies for professionals worldwide.',
    logo: '',
  },
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: data.facebookLink },
  { icon: Instagram, label: 'Instagram', href: data.instaLink },
  { icon: Twitter, label: 'Twitter', href: data.twitterLink },
  { icon: Github, label: 'GitHub', href: data.githubLink },
  { icon: Dribbble, label: 'Dribbble', href: data.dribbbleLink },
];

const aboutLinks = [
  { text: 'Company History', href: data.about.history },
  { text: 'Meet the Team', href: data.about.team },
  { text: 'Employee Handbook', href: data.about.handbook },
  { text: 'Careers', href: data.about.careers },
];

const serviceLinks = [
  { text: 'AUREX ONE', href: data.services.cameras },
  { text: 'AUREX Lenses', href: data.services.lenses },
  { text: 'Accessories', href: data.services.accessories },
  { text: 'Contact Support', href: data.services.support },
];

const helpfulLinks = [
  { text: 'FAQs', href: data.help.faqs },
  { text: 'Support', href: data.help.support },
  { text: 'Live Chat', href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="w-full bg-[#050505] border-t border-border/30 relative z-30">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand Column */}
          <div>
            <div className="flex justify-center gap-2 sm:justify-start items-center">
              <span className="text-2xl font-bold tracking-[0.2em] text-foreground">
                {data.company.name}
              </span>
            </div>

            <p className="text-[#a1a1aa] mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left text-sm">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#a1a1aa] hover:text-primary transition-colors"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            {/* About Us */}
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-white uppercase tracking-wider">About Us</p>
              <ul className="mt-6 space-y-3 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-[#a1a1aa] hover:text-primary transition-colors"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Products</p>
              <ul className="mt-6 space-y-3 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-[#a1a1aa] hover:text-primary transition-colors"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Helpful Links */}
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Helpful Links</p>
              <ul className="mt-6 space-y-3 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className={`${
                        hasIndicator
                          ? 'group flex justify-center gap-1.5 sm:justify-start items-center'
                          : 'text-[#a1a1aa] hover:text-primary transition-colors'
                      }`}
                    >
                      <span className="text-[#a1a1aa] hover:text-primary transition-colors">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-primary relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</p>
              <ul className="mt-6 space-y-3 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-2 sm:justify-start"
                      href="#"
                    >
                      <Icon className="text-primary size-4 shrink-0" />
                      {isAddress ? (
                        <address className="text-[#a1a1aa] not-italic transition hover:text-primary">
                          {text}
                        </address>
                      ) : (
                        <span className="text-[#a1a1aa] transition hover:text-primary">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/20 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-xs text-[#52525b]">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-[#52525b] mt-4 text-xs sm:order-first sm:mt-0">
              &copy; {new Date().getFullYear()} {data.company.name} Imaging Corp.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
