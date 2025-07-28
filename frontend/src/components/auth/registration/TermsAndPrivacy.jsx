import { Link } from "react-router-dom";

const TermsAndPrivacy = () => {
  return (
    <div className="mt-6 sm:mt-8 text-center px-2">
      <p className="text-xs sm:text-sm text-gray-600">
        By creating an account, you agree to our{" "}
        <Link to="/terms" className="font-medium" style={{ color: "#6ED1EA" }}>
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="font-medium"
          style={{ color: "#6ED1EA" }}
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

export default TermsAndPrivacy;
