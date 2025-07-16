import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const location = useLocation();

  // Determine if this is the home page
  const isHomePage = location.pathname === "/";

  // Determine if this should have a full-width layout (like home page)
  const isFullWidth =
    isHomePage ||
    location.pathname.includes("/auth/") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main Content Area */}
      <main
        className={
          isFullWidth ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        }
      >
        <div
          className={`w-full overflow-x-hidden ${
            !isFullWidth ? "py-6 sm:py-8 lg:py-12" : ""
          }`}
        >
          {children}
        </div>
      </main>

      {/* Footer - Only show on certain pages */}
      {(isHomePage || location.pathname.includes("/book")) && (
        <footer className="bg-gray-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9.5 16.5c0 .28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5-.5.22-.5.5zm2.5 0c0 .28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5-.5.22-.5.5zm2.5 0c0 .28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5-.5.22-.5.5zm-6.5-1c0 .28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5-.5.22-.5.5zm2.5 0c0 .28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5-.5.22-.5.5zm2.5 0c0 .28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5-.5.22-.5.5zm2.5 0c0 .28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5-.5.22-.5.5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold">CleanMatch</div>
                    <div className="text-xs text-yellow-400">
                      Professional Cleaning
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Connecting you with trusted, professional cleaners in your
                  area. Quality cleaning services made simple.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.957 1.404-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.008.085-.029.17-.061.25l-2.157 5.16c-.532 1.285-1.493 2.108-2.514 2.108-.425 0-.832-.133-1.175-.384-.485-.354-.8-.863-.8-1.443 0-.496.183-.971.515-1.337.323-.356.766-.574 1.248-.574.425 0 .832.133 1.175.384.485.354.8.863.8 1.443 0 .496-.183.971-.515 1.337-.323.356-.766.574-1.248.574-.695 0-1.336-.37-1.693-.982l-2.157-5.16c-.032-.08-.053-.165-.061-.25-.027-.283.033-.569.179-.827.146-.258.367-.471.648-.606.281-.134.598-.185.913-.143.315.042.617.174.861.378.244.204.425.47.519.763.094.293.101.607.018.907-.082.3-.246.576-.475.794-.229.218-.512.375-.818.454-.306.079-.629.077-.933-.006-.304-.083-.587-.233-.816-.433-.229-.2-.404-.449-.505-.719-.101-.27-.126-.566-.072-.851.054-.285.181-.554.368-.777.187-.223.433-.395.712-.495.279-.1.583-.125.875-.072.292.053.568.174.796.349.228.175.406.401.514.651.108.25.141.522.095.786-.046.264-.155.513-.314.719-.159.206-.366.366-.598.461-.232.095-.486.123-.734.081-.248-.042-.483-.144-.679-.294-.196-.15-.347-.346-.436-.567-.089-.221-.113-.464-.069-.697.044-.233.145-.452.292-.632.147-.18.338-.318.551-.398.213-.08.447-.099.676-.055.229.044.444.144.622.289.178.145.314.334.393.547.079.213.099.446.057.671-.042.225-.14.436-.284.611-.144.175-.333.311-.547.394-.214.083-.449.103-.678.058-.229-.045-.444-.145-.622-.29-.178-.145-.314-.334-.393-.547-.079-.213-.099-.446-.057-.671.042-.225.14-.436.284-.611.144-.175.333-.311.547-.394z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      House Cleaning
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Deep Cleaning
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Office Cleaning
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Move-in/out Cleaning
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Post-construction
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      ForeverClean Membership
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Become a Cleaner
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Press
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Safety
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Trust & Safety
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-yellow-400 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="font-semibold mb-3">Get in Touch</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      support@cleanmatch.com
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      (555) 123-CLEAN
                    </div>
                    <div className="flex items-start">
                      <svg
                        className="h-4 w-4 mr-2 mt-1 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <div>
                        123 Main Street
                        <br />
                        San Francisco, CA 94102
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm text-gray-400">
                  © 2024 CleanMatch. All rights reserved.
                </div>

                {/* Trust Badges */}
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <div className="flex items-center text-xs text-gray-400">
                    <svg
                      className="h-4 w-4 mr-1 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    </svg>
                    SSL Secured
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <svg
                      className="h-4 w-4 mr-1 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Insured & Bonded
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <svg
                      className="h-4 w-4 mr-1 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Background Checked
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
