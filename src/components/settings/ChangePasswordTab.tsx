
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Eye, EyeOff, Shield, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordTab = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<PasswordFormData>();
  
  const newPassword = watch("newPassword");
  
  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    if (!password) return { score: 0, feedback: [] };
    
    let score = 0;
    const feedback = [];
    
    if (password.length >= 8) score += 25;
    else feedback.push("At least 8 characters");
    
    if (/[a-z]/.test(password)) score += 25;
    else feedback.push("One lowercase letter");
    
    if (/[A-Z]/.test(password)) score += 25;
    else feedback.push("One uppercase letter");
    
    if (/\d/.test(password)) score += 25;
    else feedback.push("One number");
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 25;
    else feedback.push("One special character");
    
    return { score: Math.min(score, 100), feedback };
  };
  
  const passwordStrength = calculatePasswordStrength(newPassword || "");
  
  const getStrengthLabel = (score: number) => {
    if (score === 0) return "Enter password";
    if (score < 50) return "Weak";
    if (score < 75) return "Fair";
    if (score < 100) return "Good";
    return "Strong";
  };
  
  const getStrengthColor = (score: number) => {
    if (score < 50) return "bg-red-500";
    if (score < 75) return "bg-yellow-500";
    if (score < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  const onSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (passwordStrength.score < 75) {
      toast.error("Password is not strong enough");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Password changed successfully");
      reset();
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  {...register("currentPassword", { required: "Current password is required" })}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  {...register("newPassword", { required: "New password is required" })}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
              )}
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Password Strength:</span>
                    <span className={`text-sm font-medium ${
                      passwordStrength.score < 50 ? 'text-red-500' :
                      passwordStrength.score < 75 ? 'text-yellow-500' :
                      passwordStrength.score < 100 ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {getStrengthLabel(passwordStrength.score)}
                    </span>
                  </div>
                  <Progress 
                    value={passwordStrength.score} 
                    className={`h-2 ${getStrengthColor(passwordStrength.score)}`}
                  />
                  {passwordStrength.feedback.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Missing: {passwordStrength.feedback.join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  {...register("confirmPassword", { required: "Please confirm your new password" })}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Changing Password..." : "Change Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Password Security Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Password Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Minimum 8 characters long</li>
                  <li>At least one uppercase letter (A-Z)</li>
                  <li>At least one lowercase letter (a-z)</li>
                  <li>At least one number (0-9)</li>
                  <li>At least one special character (!@#$%^&*)</li>
                </ul>
                <p className="text-sm mt-3">
                  <strong>Security Tips:</strong> Use a unique password that you don't use elsewhere. 
                  Consider using a password manager to generate and store strong passwords.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordTab;
