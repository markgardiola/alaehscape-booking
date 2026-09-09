import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  UserPlus,
  UserCog,
  CalendarCheck,
  CalendarX,
  Clock,
  BadgeCheck,
  ShieldX,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/timeAgo";
import { API_URL } from "../../config";

const ICONS = {
  registration: UserPlus,
  profile_update: UserCog,
  booking_confirmed: CalendarCheck,
  booking_cancelled: CalendarX,
  refund_requested: Clock,
  refund_approved: BadgeCheck,
  refund_denied: ShieldX,
};

const ICON_COLORS = {
  registration: "text-lagoon-dark bg-lagoon/10",
  profile_update: "text-lagoon-dark bg-lagoon/10",
  booking_confirmed: "text-lagoon-dark bg-lagoon/10",
  booking_cancelled: "text-seal bg-seal/10",
  refund_requested: "text-ink bg-ink/10",
  refund_approved: "text-lagoon-dark bg-lagoon/10",
  refund_denied: "text-seal bg-seal/10",
};

const POLL_INTERVAL_MS = 30000;

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchNotifications = useCallback(() => {
    if (!token) return;
    axios
      .get(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, [token]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  if (!token) return null;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleItemClick = (notif) => {
    if (!notif.is_read) {
      axios
        .put(
          `${API_URL}/api/notifications/${notif.id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then(() =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
          ),
        )
        .catch((err) => console.error("Error marking notification read:", err));
    }

    if (notif.link) {
      setOpen(false);
      navigate(notif.link);
    }
  };

  const handleHide = (e, id) => {
    e.stopPropagation();
    axios
      .put(
        `${API_URL}/api/notifications/${id}/hide`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => setNotifications((prev) => prev.filter((n) => n.id !== id)))
      .catch((err) => console.error("Error hiding notification:", err));
  };

  const handleMarkAllRead = () => {
    axios
      .put(
        `${API_URL}/api/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() =>
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true }))),
      )
      .catch((err) => console.error("Error marking all read:", err));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative flex size-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-sand hover:text-ink"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-seal text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
          <span className="font-display text-base font-semibold text-ink">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-medium text-lagoon-dark hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink/50">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notif) => {
              const Icon = ICONS[notif.type] || Bell;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={cn(
                    "group flex cursor-pointer gap-3 border-b border-ink/5 px-4 py-3 transition-colors last:border-0 hover:bg-sand-light",
                    !notif.is_read && "bg-lagoon/5",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      ICON_COLORS[notif.type] || "bg-sand text-ink/60",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm leading-snug text-ink",
                          !notif.is_read && "font-medium",
                        )}
                      >
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-lagoon" />
                      )}
                    </div>
                    {notif.message && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-ink/60">
                        {notif.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-ink/40">
                      {timeAgo(notif.created_at)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleHide(e, notif.id)}
                    className="shrink-0 self-start rounded-full p-1 text-ink/30 opacity-0 transition-opacity hover:bg-sand hover:text-ink group-hover:opacity-100"
                    aria-label="Dismiss notification"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
