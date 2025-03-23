"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Mail, Globe, Bell, User, Shield } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold pl-8 mb-6 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
        Settings
      </h1>
      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 mt-8 mb-20">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1a2a6c]">
                  <User className="w-5 h-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24 border-4 border-white ring-2 ring-[#1a2a6c]/10">
                    <AvatarImage src={avatarUrl || "/images/icons/avatar.jpg"} alt="Profile" />
                    <AvatarFallback className="bg-[#1a2a6c]/5">
                      <User className="w-12 h-12 text-[#1a2a6c]" />
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-[#1a2a6c]/5 hover:bg-[#1a2a6c]/10 rounded-lg transition-colors">
                      <Upload className="w-4 h-4 text-[#1a2a6c]" />
                      <span className="text-sm font-medium text-[#1a2a6c]">Upload Photo</span>
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input className="pl-10 border-gray-200 focus:border-[#1a2a6c] focus:ring-[#1a2a6c]/20" placeholder="Your name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input className="pl-10 border-gray-200 focus:border-[#1a2a6c] focus:ring-[#1a2a6c]/20" type="email" placeholder="Your email" />
                    </div>
                  </div>
                  <Button className="w-full bg-[#1a2a6c] hover:bg-[#1a2a6c]/90 transition-colors">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1a2a6c]">
                  <Globe className="w-5 h-5" />
                  Preferences
                </CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <Label className="text-gray-700">Language</Label>
                  <select className="border rounded-lg px-3 py-2 bg-white border-gray-200 focus:border-[#1a2a6c] focus:ring-[#1a2a6c]/20">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-gray-700">Dark Mode</Label>
                  <Switch className="data-[state=checked]:bg-[#1a2a6c]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1a2a6c]">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Email Notifications", "Deal Alerts", "Budget Alerts"].map((item) => (
                  <div key={item} className="flex items-center justify-between py-2">
                    <Label className="text-gray-700">{item}</Label>
                    <Switch className="data-[state=checked]:bg-[#1a2a6c]" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}