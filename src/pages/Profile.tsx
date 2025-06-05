
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Bell, Shield, Crown, Save, Edit2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useUserProfile } from "@/hooks/useUserProfile";
import AppHeader from "@/components/layout/AppHeader";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const { subscribed, subscription_tier, openCustomerPortal } = useSubscription();
  const { userData, handleInputChange } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  
  // Notification preferences state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    recommendations: true,
    updates: false,
  });

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    dataSharing: false,
    analytics: true,
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success("Notification preferences updated");
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success("Privacy settings updated");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <AppHeader 
        onTakeQuestionnaire={() => {}}
        onBackToDashboard={() => {}}
        showQuestionnaire={false}
        hasProfile={true}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-green-100 text-green-700 text-lg font-semibold">
                        {userData.name ? getInitials(userData.name) : <User className="w-8 h-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {userData.name || 'Your Name'}
                        <Badge variant={subscribed ? "default" : "outline"} className="ml-2">
                          <Crown className="w-3 h-3 mr-1" />
                          {subscribed ? `${subscription_tier} Plan` : 'Free Plan'}
                        </Badge>
                      </CardTitle>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      value={userData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      value={userData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      value={userData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="healthGoals">Health Goals</Label>
                  <Input
                    id="healthGoals"
                    value={userData.healthGoals}
                    onChange={(e) => handleInputChange('healthGoals', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Weight loss, muscle gain, better energy..."
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Email Address</Label>
                    <Input value={user?.email || ''} disabled />
                    <p className="text-sm text-gray-500 mt-1">
                      Contact support to change your email address
                    </p>
                  </div>
                  <div>
                    <Label>Account Created</Label>
                    <Input 
                      value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''} 
                      disabled 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Current Plan: {subscribed ? subscription_tier : 'Free'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {subscribed 
                          ? 'Unlimited recommendations and premium features' 
                          : 'Limited recommendations per month'
                        }
                      </p>
                    </div>
                    {subscribed ? (
                      <Button variant="outline" onClick={openCustomerPortal}>
                        Manage Subscription
                      </Button>
                    ) : (
                      <Button>
                        Upgrade to Premium
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="recommendation-notifications">New Recommendations</Label>
                      <p className="text-sm text-gray-600">Get notified when new recommendations are available</p>
                    </div>
                    <Switch
                      id="recommendation-notifications"
                      checked={notifications.recommendations}
                      onCheckedChange={(checked) => handleNotificationChange('recommendations', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="update-notifications">Product Updates</Label>
                      <p className="text-sm text-gray-600">Learn about new features and improvements</p>
                    </div>
                    <Switch
                      id="update-notifications"
                      checked={notifications.updates}
                      onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="profile-visible">Profile Visibility</Label>
                      <p className="text-sm text-gray-600">Allow others to see your profile information</p>
                    </div>
                    <Switch
                      id="profile-visible"
                      checked={privacy.profileVisible}
                      onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                      <p className="text-sm text-gray-600">Share anonymized data to improve our services</p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={privacy.dataSharing}
                      onCheckedChange={(checked) => handlePrivacyChange('dataSharing', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics">Usage Analytics</Label>
                      <p className="text-sm text-gray-600">Help us understand how you use the app</p>
                    </div>
                    <Switch
                      id="analytics"
                      checked={privacy.analytics}
                      onCheckedChange={(checked) => handlePrivacyChange('analytics', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-700 mb-3">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
