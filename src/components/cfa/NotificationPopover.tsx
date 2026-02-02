import { useState } from "react";
import { Bell, Check, CheckCheck, Cloud, FileText, FlaskConical, Mail, Settings, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth, Notification } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

const notificationIcons: Record<Notification["type"], React.ElementType> = {
  sync: Cloud,
  document: FileText,
  pfas: FlaskConical,
  rfi: Mail,
  system: Settings,
};

const notificationColors: Record<Notification["type"], string> = {
  sync: "bg-blue-100 text-blue-600",
  document: "bg-emerald-100 text-emerald-600",
  pfas: "bg-rose-100 text-rose-600",
  rfi: "bg-amber-100 text-amber-600",
  system: "bg-slate-100 text-slate-600",
};

export function NotificationPopover() {
  const { notifications, unreadCount, markAsRead, markAsUnread, markAllAsRead } = useAuth();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleMarkAsUnread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsUnread(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0 shadow-lg border border-slate-200" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-rose-100 text-rose-700 border-0 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              const colorClass = notificationColors[notification.type];
              
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "flex gap-3 p-4 cursor-pointer transition-colors border-b border-slate-50 last:border-0",
                    !notification.read 
                      ? "bg-teal-50/50 hover:bg-teal-50" 
                      : "hover:bg-slate-50"
                  )}
                >
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", colorClass)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        "text-sm truncate",
                        !notification.read ? "font-semibold text-slate-900" : "font-medium text-slate-700"
                      )}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {notification.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </span>
                      {notification.read && (
                        <button
                          onClick={(e) => handleMarkAsUnread(e, notification.id)}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          Mark as unread
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setOpen(false)}
            className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium py-1"
          >
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
