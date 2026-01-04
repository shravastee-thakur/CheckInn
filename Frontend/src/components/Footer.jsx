const Footer = () => {
  return (
    <footer className="bg-[#347433] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Tagline */}
          <div>
            <div className="text-2xl font-bold mb-2">
              Check<span className="text-yellow-400">Inn</span>
            </div>
            <p className="text-blue-100 text-sm">
              Smart. Simple. Secure hotel bookings.
            </p>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Car rental
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Flight Finder
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Travel Agents
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Customer Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Partner with us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* NEW Column 4: Explore (Hotel Booking Focused) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Top Destinations
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Last-Minute Deals
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Booking Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-200 transition text-sm"
                >
                  Travel Tips
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-5 pt-4 text-center text-white text-sm">
          <p>Copyright © 2026 Shravastee Thakur</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
