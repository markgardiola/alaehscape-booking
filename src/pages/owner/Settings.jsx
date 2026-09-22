import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/PasswordInput";
import { API_URL } from "../../../config";

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSaving(true);
    axios
      .put(
        `${API_URL}/api/owner/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        console.error("Error changing password:", err);
        toast.error(
          err.response?.data?.message || "Failed to change password.",
        );
      })
      .finally(() => setSaving(false));
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>

      <Card className="mt-6 max-w-md p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Change Password
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          If you're still using the temporary password from your welcome email,
          now's a good time to change it.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-ink/80">
              Current Password
            </label>
            <div className="mt-1.5">
              <PasswordInput
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          </div>

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
              Confirm New Password
            </label>
            <div className="mt-1.5">
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="mt-2" disabled={saving}>
            {saving ? "Saving..." : "Change Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
