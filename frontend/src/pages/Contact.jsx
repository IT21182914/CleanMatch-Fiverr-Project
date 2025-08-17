import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Sparkles,
  Clock,
  CheckCircle,
} from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({
      firstName: "",
      email: "",
      phone: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of cleaning services does Simorgh Services offer?",
      answer:
        "Simorgh Services offers comprehensive cleaning solutions including residential cleaning, commercial office cleaning, deep cleaning services, carpet and upholstery cleaning, window cleaning, post-construction cleanup, and specialized sanitization services. We tailor our services to meet both private and commercial needs.",
    },
    {
      question:
        "Why should I choose Simorgh Services over other cleaning companies?",
      answer:
        "We stand out through our commitment to quality, reliability, and customer satisfaction. Our team consists of trained professionals who use eco-friendly products and modern equipment. We offer flexible scheduling, competitive pricing, comprehensive insurance coverage, and a satisfaction guarantee on all our services.",
    },
    {
      question: "Do you offer customized cleaning solutions for businesses?",
      answer:
        "Yes, absolutely! We understand that every business has unique cleaning requirements. We offer customized commercial cleaning packages that can include daily, weekly, or monthly services, specialized industry cleaning (medical, retail, hospitality), and flexible scheduling to minimize disruption to your business operations.",
    },
    {
      question: "Are your cleaning products safe for children and pets?",
      answer:
        "Yes, the safety of your family and pets is our top priority. We use eco-friendly, non-toxic cleaning products that are safe for children and pets. All our cleaning supplies are carefully selected to be effective while maintaining the highest safety standards for your home environment.",
    },
    {
      question: "How can I book a cleaning service with Simorgh Services?",
      answer:
        "Booking is easy! You can contact us through this contact form, call us directly, or use our online booking system. We'll discuss your specific needs, provide a free quote, and schedule a convenient time for service. We offer flexible scheduling including same-day service when available.",
    },
  ];

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Premium Quality",
      description: "Exceptional cleaning standards every time",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Always here when you need us",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Satisfaction Guaranteed",
      description: "100% satisfaction or money back",
    },
  ];

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Font Loading */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-cyan-100/30 to-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-br from-teal-100/20 to-cyan-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/60"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/Office-Cleaning.jpg')",
          }}
        ></div>
        {/* Enhanced Professional overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-800/60"></div>

        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="max-w-4xl">
            <div className="mb-8">
              <span className="inline-flex items-center px-6 py-3 rounded-full text-base font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-2xl shadow-black/20">
                <Sparkles className="w-5 h-5 mr-3" />
                Professional Cleaning Services
              </span>
            </div>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-2xl"
              style={{
                textShadow:
                  "0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)",
              }}
            >
              Get in Touch with{" "}
              <span className="text-white drop-shadow-2xl">
                Simorgh Services
              </span>
            </h1>

            <p
              className="text-2xl md:text-3xl text-white mb-10 max-w-3xl leading-relaxed drop-shadow-xl font-medium"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
            >
              Your trusted cleaning partner for private and commercial spaces.
              Experience excellence in every detail with our professional team.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-white text-gray-800 px-10 py-5 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl shadow-black/30">
                Get Free Quote
              </button>
              <button
                onClick={() => navigate("/services")}
                className="border-3 border-white text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-white/15 transition-all duration-300 backdrop-blur-md shadow-2xl shadow-black/30"
              >
                View Services
              </button>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-gray-300/20 rounded-full blur-2xl animate-pulse"></div>
      </section>

      {/* Features Section */}
      <div className="relative py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl mb-6 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 shadow-lg shadow-cyan-200/30">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-gray-700 leading-relaxed text-lg font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-8"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Let's Start the{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Conversation
              </span>
            </h2>
            <p
              className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Ready to experience premium cleaning services? Get in touch with
              us today for a personalized consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left side - Enhanced Visual */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-100/50 to-teal-100/50 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600585152915-d208bec867a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Professional Office Cleaning Service"
                  className="w-full h-[520px] object-cover rounded-2xl shadow-2xl shadow-gray-200/50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent rounded-2xl"></div>

                {/* Floating Contact Cards */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p
                          className="text-sm text-gray-600 mb-1 font-medium"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Email us
                        </p>
                        <p
                          className="text-gray-900 font-bold text-xl"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          contact@simorghservice.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Modern Form */}
            <div className="relative">
              <div className="bg-white border border-gray-100 p-10 rounded-3xl shadow-2xl shadow-gray-200/20">
                <div className="mb-8">
                  <h3
                    className="text-3xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Send us a Message
                  </h3>
                  <p
                    className="text-gray-700 text-lg font-medium"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    We'll get back to you within 24 hours
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-base font-bold text-gray-800 mb-3"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white transition-all duration-300"
                        placeholder="Enter your first name"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-base font-bold text-gray-800 mb-3"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white transition-all duration-300"
                        placeholder="Enter your phone number"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-base font-bold text-gray-800 mb-3"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white transition-all duration-300"
                      placeholder="Enter your email address"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-base font-bold text-gray-800 mb-3"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none focus:bg-white transition-all duration-300"
                      placeholder="Tell us how we can help you..."
                      style={{ fontFamily: "Inter, sans-serif" }}
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-cyan-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-cyan-200/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending Message...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-8"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p
              className="text-2xl text-gray-700 leading-relaxed font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Everything you need to know about our cleaning services
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-inset"
                >
                  <div className="flex justify-between items-center">
                    <h3
                      className="text-xl font-bold text-gray-900 pr-4"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {faq.question}
                    </h3>
                    <div
                      className={`transform transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openFaq === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-8 pb-6">
                    <p
                      className="text-gray-700 leading-relaxed text-lg font-medium"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
