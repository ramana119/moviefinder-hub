
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Subscribed with email: ${email}`);
    setEmail("");
    // Here you would typically call an API to subscribe the user
  };

  const footerLinks = [
    {
      title: "About",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Contact", path: "/contact" },
        { name: "FAQ", path: "/faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Cookie Policy", path: "/cookies" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Customer Support", path: "/support" },
        { name: "Feedback", path: "/feedback" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram", url: "https://instagram.com" },
    { icon: Twitter, label: "Twitter", url: "https://twitter.com" },
    { icon: Facebook, label: "Facebook", url: "https://facebook.com" },
    { icon: Mail, label: "Email", url: "mailto:contact@cinemagic.com" },
  ];

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand and description */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-primary">CineMagic</div>
            <p className="text-gray-600 max-w-xs">
              Transforming movie experiences with a seamless booking platform that
              brings cinema magic to your fingertips.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Newsletter</h3>
            <p className="text-gray-600">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CineMagic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
