import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#FDF6E3] text-[#3A2F2A] px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-xl font-semibold mb-4">📜 About Memory Vault</h3>
          <p className="text-sm leading-6">
            Memory Vault is your secure capsule for treasured moments. Store, protect, and revisit your memories with elegance. 🌟
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">🧭 Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li><a href="/faq" className="hover:text-[#D97D54]">❓ FAQ</a></li>
            <li><a href="/privacy" className="hover:text-[#D97D54]">🔐 Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-[#D97D54]">📃 Terms of Service</a></li>
            <li><a href="/contact" className="hover:text-[#D97D54]">📩 Contact Us</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl font-semibold mb-4">🌐 Connect With Us</h3>
          <ul className="text-sm space-y-2">
            <li><a href="https://www.instagram.com/_soham_27_?igsh=djJnb3pzMTYxcGw1" target="_blank" rel="noreferrer" className="hover:text-[#D97D54]">📷 Instagram</a></li>
            <li><a href="https://www.linkedin.com/in/soham-babshetye-b2b8ab271?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer" className="hover:text-[#D97D54]">💼 LinkedIn</a></li>
            {/* <li><a href="#" className="hover:text-[#D97D54]">✉️ hello@memoryvault.com</a></li> */}
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-[#7E6651]">
        © {new Date().getFullYear()} Memory Vault. Made with ❤️ & vintage vibes.
      </div>
    </footer>
  );
};

export default Footer;
