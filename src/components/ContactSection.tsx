import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Youtube, Send } from 'lucide-react';
import { SystemSettings } from '../types.js';

interface ContactSectionProps {
  settings?: SystemSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [contactName, setContactName] = useState('Anirudra Paul');
  const [contactEmail, setContactEmail] = useState('anirudra@gmail.com');
  const [inquiryType, setInquiryType] = useState('booking'); // booking, feedback, business
  const [contactMsg, setContactMsg] = useState('Looking forward to booking Rangrez for our college cultural fusion night show on October!');
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState('');

  // Admin settings fields
  const adminEmail = settings?.contactEmail || "rangrezencore@gmail.com";
  const adminPhone = settings?.contactPhone || "+91 98765 43210";
  const adminOffice = settings?.contactOffice || "Koregaon Park Road, Pune, Maharashtra";
  const adminInstagram = settings?.contactInstagram || "https://www.instagram.com/rangrezencore?igsh=MWNpZThta3A3aDc3cQ==";

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingInquiry(true);
    setInquirySuccessMsg('');

    setTimeout(() => {
      setIsSendingInquiry(false);
      setInquirySuccessMsg(`Thank you, ${contactName}! We received your ${inquiryType} inquiry. The Rangrez team will reach out to you within 24 hours.`);
      setContactMsg('');
    }, 1200);
  };

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto text-white relative z-10 space-y-16 animate-in fade-in duration-500">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-mono font-bold block mb-2">Connect Sitar</span>
        <h2 className="text-3xl md:text-5xl font-black">Get In Touch</h2>
        <div className="w-16 h-[1.5px] bg-[#D4AF37] mx-auto mt-4" />
      </div>

      <div className="grid md:grid-cols-12 gap-10 items-stretch">
        {/* Business management details card */}
        <div className="col-span-12 md:col-span-5 bg-[#181524]/50 border border-[#8A2BE2]/15 p-6 md:p-8 rounded-3xl flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-purple-400 block mb-2">Management & Bookings</span>
            <h3 className="text-2xl font-black text-zinc-100">Invite {settings?.bandName || "Rangrez"}</h3>
            <p className="text-zinc-300 text-xs md:text-sm mt-3 leading-relaxed">
              For commercial booking inquiries, corporate festivals, private sufi concerts, or licensing collaborations worldwide, reach out directly to the core artist management.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3.5 text-xs text-zinc-300">
              <Mail className="w-5 h-5 text-[#D4AF37]" />
              <span>{adminEmail}</span>
            </div>
            <div className="flex items-center gap-3.5 text-xs text-zinc-300">
              <Phone className="w-5 h-5 text-[#D4AF37]" />
              <span>{adminPhone}</span>
            </div>
            <div className="flex items-center gap-3.5 text-xs text-zinc-300">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <span>{adminOffice}</span>
            </div>
          </div>

          {/* Quick Social icons */}
          <div className="flex items-center gap-3 pt-6 border-t border-white/5 text-zinc-300">
            <a href={adminInstagram.startsWith('http') ? adminInstagram : `https://instagram.com/${adminInstagram}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 border border-white/5 hover:text-[#D4AF37] hover:bg-white/10 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 border border-white/5 hover:text-[#D4AF37] hover:bg-white/10 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Interactive Input Inquiry Form */}
        <form onSubmit={handleInquirySubmit} id="contact-inquiry-form" className="col-span-12 md:col-span-7 bg-[#181524]/80 border border-white/5 p-6 md:p-8 rounded-3xl space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] block uppercase font-bold mb-1">Electronic inquiries</span>
          <h3 className="text-lg font-bold text-white mb-2">Submit Booking Inquiry Form</h3>
          
          {inquirySuccessMsg ? (
            <div className="bg-green-950/40 border border-green-500/20 p-5 rounded-xl text-xs text-green-300 space-y-2 text-center pointer-events-auto">
              <span className="font-extrabold text-sm block">✓ Form Transmitted</span>
              <p>{inquirySuccessMsg}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-400 font-mono uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    id="contact-form-name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-400 font-mono uppercase">Email ID</label>
                  <input
                    type="email"
                    required
                    id="contact-form-email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-400 font-mono uppercase">Inquiry Purpose</label>
                <select
                  value={inquiryType}
                  id="contact-form-type"
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full bg-[#181524] border border-[#8A2BE2]/20 rounded-lg px-3 py-2.5 text-xs cursor-pointer text-zinc-200 focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="booking">🎵 Commercial Band Booking</option>
                  <option value="feedback">💖 Fan Feedback / Greetings</option>
                  <option value="business">🤝 Corporate Brand Tie-up</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-400 font-mono uppercase">Your Message</label>
                <textarea
                  required
                  rows={4}
                  id="contact-form-msg"
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                id="contact-form-submit-btn"
                disabled={isSendingInquiry}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8A2BE2] text-black font-extrabold uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98]"
              >
                {isSendingInquiry ? "Transmitting..." : "Send Secure Message"}
                <Send className="w-3.5 h-3.5 text-black" />
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
