import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, User, Mail, Building2, Globe, Bell, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Berlin", label: "Central European Time (CET)" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [organization, setOrganization] = useState(user?.organization || "");
  const [timezone, setTimezone] = useState(user?.timezone || "America/New_York");
  const [emailNotifications, setEmailNotifications] = useState(user?.notificationPreferences.email ?? true);
  const [pushNotifications, setPushNotifications] = useState(user?.notificationPreferences.push ?? true);
  const [digestNotifications, setDigestNotifications] = useState(user?.notificationPreferences.digest ?? false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    updateProfile({
      fullName,
      organization,
      timezone,
      notificationPreferences: {
        email: emailNotifications,
        push: pushNotifications,
        digest: digestNotifications,
      },
    });

    setIsLoading(false);
    setIsSaved(true);
    
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });

    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/platform")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">Profile Settings</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSave}>
          {/* Profile Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
              <p className="text-sm text-slate-500 mt-1">Update your personal details</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Avatar and name */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-1">Profile photo</p>
                  <Button type="button" variant="outline" size="sm">
                    Change photo
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-700">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email address
                    <span className="text-slate-400 font-normal ml-2">(read-only)</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="h-11 pl-10 bg-slate-50 text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-700">
                    Role
                    <span className="text-slate-400 font-normal ml-2">(read-only)</span>
                  </Label>
                  <Input
                    id="role"
                    value={user.role}
                    disabled
                    className="h-11 bg-slate-50 text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-slate-700">Organization</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="timezone" className="text-slate-700">Time Zone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="h-11">
                      <Globe className="w-4 h-4 text-slate-400 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">Manage how you receive notifications</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-slate-900">Email notifications</p>
                  <p className="text-sm text-slate-500">Receive updates via email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <div>
                  <p className="font-medium text-slate-900">Push notifications</p>
                  <p className="text-sm text-slate-500">Receive browser push notifications</p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <div>
                  <p className="font-medium text-slate-900">Daily digest</p>
                  <p className="text-sm text-slate-500">Receive a daily summary of activity</p>
                </div>
                <Switch 
                  checked={digestNotifications} 
                  onCheckedChange={setDigestNotifications}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/platform")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white min-w-[120px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
