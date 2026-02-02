import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password, rememberMe);
    
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/platform");
    } else {
      setError(result.error || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-slate-900" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PFAS Intelligence</h1>
              <p className="text-slate-400 text-sm">Compliance Forensic Agent</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            EPA TSCA Section 8(a)(7)
            <br />
            <span className="text-teal-400">Compliance Made Simple</span>
          </h2>
          
          <p className="text-slate-300 text-lg mb-8 max-w-md">
            Transform legacy documents into actionable PFAS intelligence. 
            Meet your October 2026 deadline with confidence.
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-3xl font-bold text-teal-400">10,000+</p>
              <p className="text-slate-400 text-sm">Documents Processed</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-3xl font-bold text-teal-400">99.2%</p>
              <p className="text-slate-400 text-sm">Detection Accuracy</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">PFAS Intelligence</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-500 mt-1">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                  Contact sales
                </a>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
