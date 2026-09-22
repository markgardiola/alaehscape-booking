import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import PasswordInput from "@/components/PasswordInput";
import IconInput from "@/components/IconInput";
import OtpInput from "@/components/OtpInput";
import StepIndicator from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/lib/useCountdown";
import { API_URL } from "../../config";

const RESEND_COOLDOWN_SECONDS = 60;

const OwnerForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 email, 2 otp, 3 new password
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resendCooldown = useCountdown();
  const navigate = useNavigate();

  const handleRequestOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${API_URL}/api/owner/password-reset/request-otp`, { email })
      .then((res) => {
        setMaskedEmail(res.data.maskedEmail);
        toast.success("Code sent to your email.");
        setStep(2);
        resendCooldown.start(RESEND_COOLDOWN_SECONDS);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    axios
      .post(`${API_URL}/api/owner/password-reset/verify-otp`, { email, otp })
      .then((res) => {
        setResetToken(res.data.resetToken);
        setStep(3);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Incorrect code.");
      })
      .finally(() => setLoading(false));
  };

  const handleResend = () => {
    setLoading(true);
    axios
      .post(`${API_URL}/api/owner/password-reset/resend-otp`, { email })
      .then(() => {
        toast.success("A new code has been sent.");
        setOtp("");
        resendCooldown.start(RESEND_COOLDOWN_SECONDS);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to resend code.");
      })
      .finally(() => setLoading(false));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    axios
      .post(`${API_URL}/api/owner/password-reset/reset`, {
        resetToken,
        newPassword,
      })
      .then(() => {
        toast.success("Password reset successfully. Please sign in.");
        navigate("/owner/login");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to reset password.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthShell
      variant="ink"
      eyebrow="Owner account recovery"
      title="Let's get you back into your portal."
      subtitle="We'll send a verification code to the email on file for your resort."
    >
      <StepIndicator
        steps={["Find account", "Verify", "New password"]}
        current={step}
      />

      {step === 1 && (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Enter the email your resort is listed under.
          </p>
          <form
            onSubmit={handleRequestOtp}
            className="mt-6 flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-ink/80"
              >
                Email
              </label>
              <div className="mt-1.5">
                <IconInput
                  icon={Mail}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full"
              disabled={loading}
            >
              {loading ? "Sending code..." : "Send Code"}
            </Button>
            <p className="text-center text-sm text-ink/60">
              Remembered it after all?{" "}
              <Link
                to="/owner/login"
                className="font-medium text-lagoon-dark hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Enter Verification Code
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-ink">{maskedEmail}</span>.
          </p>

          <form onSubmit={handleVerifyOtp} className="mt-6 flex flex-col gap-5">
            <OtpInput value={otp} onChange={setOtp} disabled={loading} />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-ink/60 hover:text-ink"
              >
                &larr; Use a different email
              </button>

              {resendCooldown.isActive ? (
                <span className="text-ink/40">
                  Resend in {resendCooldown.seconds}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="font-medium text-lagoon-dark hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              )}
            </div>
          </form>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Choose a new password for your Owner Portal account.
          </p>

          <form
            onSubmit={handleResetPassword}
            className="mt-6 flex flex-col gap-4"
          >
            <div>
              <label className="text-sm font-medium text-ink/80">
                New Password
              </label>
              <div className="mt-1.5">
                <PasswordInput
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink/80">
                Confirm Password
              </label>
              <div className="mt-1.5">
                <PasswordInput
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </>
      )}
    </AuthShell>
  );
};

export default OwnerForgotPassword;
