import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, Phone, ArrowRight } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import PasswordInput from "@/components/PasswordInput";
import IconInput from "@/components/IconInput";
import OtpInput from "@/components/OtpInput";
import StepIndicator from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/lib/useCountdown";
import { cn } from "@/lib/utils";
import { API_URL } from "../../config";

const RESEND_COOLDOWN_SECONDS = 60;

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 email, 2 choose method, 3 otp, 4 new password
  const [email, setEmail] = useState("");
  const [options, setOptions] = useState(null); // { maskedEmail, maskedPhone, smsAvailable }
  const [channel, setChannel] = useState(null);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resendCooldown = useCountdown();
  const navigate = useNavigate();

  const handleLookup = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${API_URL}/api/password-reset/lookup`, { email })
      .then((res) => {
        setOptions(res.data);
        setStep(2);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  const handleChooseChannel = (selectedChannel) => {
    setChannel(selectedChannel);
    setLoading(true);
    axios
      .post(`${API_URL}/api/password-reset/request-otp`, {
        email,
        channel: selectedChannel,
      })
      .then(() => {
        toast.success(
          selectedChannel === "sms"
            ? "Code sent via SMS."
            : "Code sent to your email.",
        );
        setStep(3);
        resendCooldown.start(RESEND_COOLDOWN_SECONDS);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to send code.");
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
      .post(`${API_URL}/api/password-reset/verify-otp`, { email, otp })
      .then((res) => {
        setResetToken(res.data.resetToken);
        setStep(4);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Incorrect code.");
      })
      .finally(() => setLoading(false));
  };

  const handleResend = () => {
    setLoading(true);
    axios
      .post(`${API_URL}/api/password-reset/resend-otp`, { email })
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
      .post(`${API_URL}/api/password-reset/reset`, { resetToken, newPassword })
      .then(() => {
        toast.success("Password reset successfully. Please sign in.");
        navigate("/signIn");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to reset password.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Let's get you back in."
      subtitle="Recover access to your account using either your email or your registered mobile number."
    >
      <StepIndicator
        steps={["Find account", "Choose method", "Verify", "New password"]}
        current={step}
      />

      {step === 1 && (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Enter the email on your account and we'll help you get back in.
          </p>
          <form onSubmit={handleLookup} className="mt-6 flex flex-col gap-4">
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
              {loading ? "Looking up account..." : "Continue"}
            </Button>
            <p className="text-center text-sm text-ink/60">
              Remembered it after all?{" "}
              <Link
                to="/signIn"
                className="font-medium text-lagoon-dark hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </>
      )}

      {step === 2 && options && (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Choose Recovery Method
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            How would you like to receive your verification code?
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => handleChooseChannel("email")}
              disabled={loading}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3.5 text-left transition-colors hover:border-lagoon disabled:opacity-50",
                channel === "email" && "border-lagoon bg-lagoon/5",
              )}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lagoon/10 text-lagoon-dark">
                <Mail className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">Email</p>
                <p className="text-xs text-ink/50">{options.maskedEmail}</p>
              </div>
              <ArrowRight className="size-4 text-ink/30" />
            </button>

            <button
              onClick={() => options.smsAvailable && handleChooseChannel("sms")}
              disabled={loading || !options.smsAvailable}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3.5 text-left transition-colors hover:border-lagoon disabled:opacity-50",
                channel === "sms" && "border-lagoon bg-lagoon/5",
              )}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lagoon/10 text-lagoon-dark">
                <Phone className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">SMS</p>
                <p className="text-xs text-ink/50">
                  {options.smsAvailable
                    ? options.maskedPhone
                    : "No phone number on file for this account"}
                </p>
              </div>
              {options.smsAvailable && (
                <ArrowRight className="size-4 text-ink/30" />
              )}
            </button>
          </div>

          <button
            onClick={() => setStep(1)}
            className="mt-5 text-sm text-ink/60 hover:text-ink"
          >
            &larr; Use a different email
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Enter Verification Code
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            We sent a 6-digit code via {channel === "sms" ? "SMS" : "email"} to{" "}
            <span className="font-medium text-ink">
              {channel === "sms" ? options.maskedPhone : options.maskedEmail}
            </span>
            .
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
                onClick={() => setStep(2)}
                className="text-ink/60 hover:text-ink"
              >
                &larr; Choose another method
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

      {step === 4 && (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Choose a new password for your account.
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

export default ForgotPassword;
