"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (step === 2) {
      setTimerActive(true);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step]);

  // Handle timeout
  const handleTimeout = () => {
    toast.error("OTP expired.");
    router.push("/");
  };

  // Handle OTP change
  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        (
          document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement
        )?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (step === 1) {
        const res = await fetch("/api/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Failed to send OTP");
          return;
        }

        toast.success("OTP sent to your email!");
        setStep(2);
        setToastShown(false);
        setCountdown(120); // Reset countdown
      } else if (step === 2) {
        const otpCode = otp.join("");
        const res = await fetch("/api/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, otp: otpCode }),
        });

        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Invalid OTP");
          return;
        }

        if (!toastShown) {
          toast.success("OTP verified! Redirecting to password reset page...");
          setToastShown(true);
        }

        setTimeout(() => {
          router.push(`/resetPassword?username=${username}`);
        }, 1000);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <Toaster />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">
          {step === 1 ? "Reset Password" : "Verify OTP"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6">
          {step === 1 ? (
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ) : (
            <div>
              <div className="flex space-x-2 mb-4 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && index > 0) {
                        (
                          document.getElementById(
                            `otp-input-${index - 1}`
                          ) as HTMLInputElement
                        )?.focus();
                      }
                    }}
                    inputMode="numeric"
                    className={`w-14 h-14 text-center border rounded-md transition duration-200 focus:outline-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md`}
                    required
                  />
                ))}
              </div>
              <div className="text-center text-sm text-gray-600 mb-4">
                {`Time remaining: ${Math.floor(countdown / 60)}:${String(
                  countdown % 60
                ).padStart(2, "0")}`}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white ${
              loading ? "bg-gray-400" : "bg-blue-600"
            } rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? "Sending..." : step === 1 ? "Send OTP" : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
