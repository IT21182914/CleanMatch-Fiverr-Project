import React, { useState } from "react";
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
      <div className="relative">
        <div className="relative h-[75vh] overflow-hidden">
          {/* Enhanced Background Image with Better Visibility */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            }}
          />

          {/* Modern Gradient Overlay for Better Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/75"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10"></div>

          {/* Content */}
          <div className="relative z-10 flex items-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-4xl">
                <div className="mb-8 inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200/50 rounded-full shadow-sm">
                  <Sparkles className="h-5 w-5 text-cyan-600 mr-3" />
                  <span
                    className="text-cyan-700 font-medium"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Professional Cleaning Services
                  </span>
                </div>

                <h1
                  className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <span className="text-gray-800">Contact</span>
                  <br />
                  <span className="text-4xl md:text-6xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Simorgh Services
                  </span>
                </h1>

                <p
                  className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-10 max-w-3xl"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Your trusted cleaning partner for private and commercial
                  spaces. Experience excellence in every detail with our
                  professional team.
                </p>

                <div className="flex flex-wrap gap-6">
                  <button
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-cyan-200/50"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Get Free Quote
                  </button>
                  <button
                    className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-300 shadow-lg"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    View Services
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  className="text-xl font-semibold text-gray-800 mb-3"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-gray-600 leading-relaxed"
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
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Let's Start the{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Conversation
              </span>
            </h2>
            <p
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
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
                          className="text-sm text-gray-500 mb-1"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Email us
                        </p>
                        <p
                          className="text-gray-800 font-semibold text-lg"
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
                    className="text-2xl font-bold text-gray-800 mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Send us a Message
                  </h3>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    We'll get back to you within 24 hours
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-3"
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
                        className="block text-sm font-semibold text-gray-700 mb-3"
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
                      className="block text-sm font-semibold text-gray-700 mb-3"
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
                      className="block text-sm font-semibold text-gray-700 mb-3"
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

                {/* Additional Contact Info */}
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h4
                    className="text-lg font-semibold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Alternative Contact Methods
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600 hover:text-gray-800 transition-colors group cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-lg">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <span
                        className="font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        +1 (555) 123-4567
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 hover:text-gray-800 transition-colors group cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-lg">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <span
                        className="font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Professional Cleaning Services
                      </span>
                    </div>
                  </div>
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
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p
              className="text-xl text-gray-600 leading-relaxed"
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
                      className="text-lg font-semibold text-gray-800 pr-4"
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
                      className="text-gray-600 leading-relaxed"
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
