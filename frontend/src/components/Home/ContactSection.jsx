import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

const ContactSection = () => {
  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 bg-gradient-to-br from-[#F0FBFE] to-white relative">
      <div className="w-full max-w-none px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="text-center mb-12 xs:mb-16">
          <div className="inline-flex items-center px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-gradient-to-r from-[#E0F6FD] to-[#BAEDFB] text-[#2BA8CD] font-semibold text-xs xs:text-sm mb-4 xs:mb-6">
            <PhoneIcon className="h-3 xs:h-4 w-3 xs:w-4 mr-1.5 xs:mr-2" />
            Get In Touch
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 xs:mb-6">
            Need Help or Have Questions?
          </h2>
          <p className="text-lg xs:text-xl text-slate-600 max-w-3xl mx-auto px-2 xs:px-0">
            Our customer service team is here to help you 24/7
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xs:gap-8">
          <Card className="text-center p-6 xs:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl xs:rounded-2xl">
            <CardContent className="p-0">
              <div className="w-12 xs:w-16 h-12 xs:h-16 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-4 xs:mb-6">
                <PhoneIcon className="h-6 xs:h-8 w-6 xs:w-8 text-white" />
              </div>
              <h3 className="text-lg xs:text-xl font-bold text-slate-900 mb-3 xs:mb-4">
                Call Us
              </h3>
              <p className="text-slate-600 mb-3 xs:mb-4 text-sm xs:text-base">
                Speak with our experts
              </p>
              <p className="text-xl xs:text-2xl font-bold text-[#4EC6E5]">
                1-800-SIMORGH
              </p>
              <p className="text-xs xs:text-sm text-slate-500 mt-2">
                Available 24/7
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 xs:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl xs:rounded-2xl">
            <CardContent className="p-0">
              <div className="w-12 xs:w-16 h-12 xs:h-16 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-4 xs:mb-6">
                <ChatBubbleLeftRightIcon className="h-6 xs:h-8 w-6 xs:w-8 text-white" />
              </div>
              <h3 className="text-lg xs:text-xl font-bold text-slate-900 mb-3 xs:mb-4">
                Live Chat
              </h3>
              <p className="text-slate-600 mb-3 xs:mb-4 text-sm xs:text-base">
                Instant support online
              </p>
              <Button className="bg-gradient-to-r from-[#4EC6E5] to-[#2BA8CD] hover:from-[#3BB8DF] hover:to-[#2293B5] text-white px-4 xs:px-6 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-sm xs:text-base">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6 xs:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl xs:rounded-2xl">
            <CardContent className="p-0">
              <div className="w-12 xs:w-16 h-12 xs:h-16 bg-gradient-to-br from-[#4EC6E5] to-[#2BA8CD] rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-4 xs:mb-6">
                <ClipboardDocumentListIcon className="h-6 xs:h-8 w-6 xs:w-8 text-white" />
              </div>
              <h3 className="text-lg xs:text-xl font-bold text-slate-900 mb-3 xs:mb-4">
                Help Center
              </h3>
              <p className="text-slate-600 mb-3 xs:mb-4 text-sm xs:text-base">
                Find answers quickly
              </p>
              <Button
                variant="outline"
                className="border-2 border-[#4EC6E5] text-[#4EC6E5] hover:bg-[#4EC6E5] hover:text-white px-4 xs:px-6 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-sm xs:text-base"
              >
                Browse FAQs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
