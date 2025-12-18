import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/common/Button";
import OtpBoxInput from "../../components/common/OtpBoxInput";
import {
  verifyOTP,
  resendOTP,
  resetOtpState,
} from "../../store/slices/otpSlice";
import useOtpTimer from "../../hooks/useOtpTimer";
import { Notify } from "../../utils/notify";

export default function VerifyOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, success, error } = useSelector((state) => state.otp);

  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const { timeLeft, resetTimer } = useOtpTimer(60);

  const handleVerify = () => {
    if (otp.length !== 6) {
      Notify("Enter 6 digit OTP", "warning");
      return;
    }

    dispatch(verifyOTP({ email, otp }));
  };

  const handleResend = () => {
    dispatch(resendOTP(email));
    resetTimer();
    Notify("OTP resent successfully", "success");
  };

  useEffect(() => {
    if (success) {
      Notify("OTP verified successfully", "success");
      dispatch(resetOtpState());
      navigate("/login");
    }

    if (error) Notify(error, "error");
  }, [success, error, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold">
            Meet<span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-gray-400 mt-2">Enter OTP sent to your email</p>
        </div>

        <div className="space-y-6">
          <OtpBoxInput value={otp} onChange={setOtp} />

          <div className="text-center text-sm text-gray-400">
            OTP expires in <span className="text-blue-500">{timeLeft}s</span>
          </div>

          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-2.5 text-base font-semibold rounded-xl"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center">
            <button
              disabled={timeLeft > 0}
              onClick={handleResend}
              className={`text-sm ${
                timeLeft > 0 ? "text-gray-500" : "text-blue-500 hover:underline"
              }`}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
