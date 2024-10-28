"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface OtpVerificationDialogProps {
  onClose: () => void;
  username: string;
  onSuccess: () => void;
}

export const OtpVerificationDialog: React.FC<OtpVerificationDialogProps> = ({
  onClose,
  username,
  onSuccess,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          toast.error("OTP has expired.");
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;

      setOtp(newOtp);

      if (value && index < 5) {
        (
          document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement
        )?.focus();
      }
    }
  };

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("").trim();

    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, otp: otpValue }),
      });

      if (!res.ok) throw new Error("Invalid or expired OTP.");
      toast.success("Sign in successful. Redirecting...");
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to verify OTP.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent className="flex flex-col items-center justify-center p-6">
        <h3 className="mb-4 text-lg font-semibold">Enter the 6-digit OTP</h3>
        <p className="mb-4">
          {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
          {timeLeft % 60} remaining
        </p>
        <div className="flex space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && digit === "") {
                  if (index > 0) {
                    (
                      document.getElementById(
                        `otp-input-${index - 1}`
                      ) as HTMLInputElement
                    )?.focus();
                  }
                }
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-10 h-10 text-center border rounded"
            />
          ))}
        </div>
        <Button
          onClick={handleOtpSubmit}
          disabled={isLoading}
          className="mt-4 w-full"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
