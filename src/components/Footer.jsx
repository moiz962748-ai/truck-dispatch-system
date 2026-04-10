import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-white font-bold">TD</span>
              </div>
              <span className="text-lg font-bold text-slate-900">Truck Dispatch</span>
            </div>
            <p className="text-sm text-slate-600">
              Manage loads, assign drivers, and streamline your dispatch operations.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Product</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/home" className="hover:text-slate-900">Home</Link></li>
              <li><Link to="/login" className="hover:text-slate-900">Login</Link></li>
              <li><Link to="/register" className="hover:text-slate-900">Register</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="/#about" className="hover:text-slate-900">About</a></li>
              <li><a href="/#blog" className="hover:text-slate-900">Blog</a></li>
              <li><a href="/#careers" className="hover:text-slate-900">Careers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Support</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="/#help" className="hover:text-slate-900">Help Center</a></li>
              <li><a href="/#privacy" className="hover:text-slate-900">Privacy Policy</a></li>
              <li><a href="/#terms " className="hover:text-slate-900">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600">
            <p>&copy; 2026 Truck Dispatch System. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-slate-900">Twitter</a>
              <a href="#" className="hover:text-slate-900">LinkedIn</a>
              <a href="#" className="hover:text-slate-900">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
