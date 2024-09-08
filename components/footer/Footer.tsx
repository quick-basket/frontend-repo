import React from 'react';
import {Mail, Phone} from "lucide-react";
import Image from "next/image";

const Footer = () => {
    const footerSections = [
        {
            title: "Layanan Pelanggan",
            items: ["Pertanyaan Umum", "Cara Belanja", "A-Poin", "Gratis Ongkir"]
        },
        {
            title: "Jelajahi Alfagift",
            items: ["Tentang Alfagift", "Syarat & Ketentuan", "Kebijakan Privasi", "Karir", "Blog"]
        },
        {
            title: "Metode Pembayaran",
            items: ["cod", "bca", "mandiri", "credit-card"]
        },
        {
            title: "Layanan Pengiriman",
            items: ["truck"]
        },
        {
            title: "Ikuti Kami",
            items: ["facebook", "twitter", "instagram"]
        }
    ];

    return (
        <footer className="bg-white shadow-lg mt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-10">
                {/* Mobile View */}
                <div className="md:hidden">
                    {footerSections.map((section, index) => (
                        <div key={index} className="border-t border-gray-200 py-4">
                            <h3 className="font-semibold mb-2">{section.title}</h3>
                            <div className="flex flex-wrap gap-4">
                                {section.items.map((item, itemIndex) => (
                                    <span key={itemIndex} className="text-sm text-gray-600">
                    {item}
                  </span>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="border-t border-gray-200 py-4">
                        <h3 className="font-semibold mb-2">Hubungi Kami</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={16} />
                            <span>alfacare@sat.co.id</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                            <Phone size={16} />
                            <span>1500-959</span>
                        </div>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:flex justify-between">
                    {footerSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold mb-4">{section.title}</h3>
                            <ul>
                                {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-sm text-gray-600 mb-2">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <h3 className="font-semibold mb-4">Hubungi Kami</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Mail size={16} />
                            <span>alfacare@sat.co.id</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={16} />
                            <span>1500-959</span>
                        </div>
                    </div>
                </div>

                {/* App Store Links and Copyright */}
                <div className="mt-8 flex justify-between items-center">
                    <div className="flex gap-4">
                        <Image src="/google-play.png" alt="Get it on Google Play" width={120} height={40} />
                        <Image src="/app-store.png" alt="Download on App Store" width={120} height={40} />
                    </div>
                    <p className="text-sm text-gray-600">© 2022, PT. Sumber Alfaria Trijaya</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;