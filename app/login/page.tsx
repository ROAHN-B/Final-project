// app/login/page.tsx (Updated with pre-check logic)
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Globe, Leaf, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { useAuth, User } from "@/contexts/auth-context";
import { useLanguage, type Language } from "@/contexts/language-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface LocationData {
  [key: string]: {
    name: string;
    districts: {
      [key: string]: string[];
    };
  };
}

const locationData: LocationData = {
  MH: {
    name: "Maharashtra",
    districts: {
      Mumbai: ["Mumbai City", "Mumbai Suburban", "Thane", "Kalyan"],
      Pune: ["Pune City", "Pimpri-Chinchwad", "Baramati", "Maval"],
      Nashik: ["Nashik City", "Malegaon", "Sinnar", "Dindori"],
      Aurangabad: ["Aurangabad City", "Jalna", "Beed", "Osmanabad"],
      Solapur: ["Solapur City", "Pandharpur", "Barshi", "Karmala"],
      Nagpur: ["Nagpur City", "Wardha", "Bhandara", "Gondia"],
    },
  },
  KA: {
    name: "Karnataka",
    districts: {
      Bangalore: ["Bangalore Urban", "Bangalore Rural", "Ramanagara", "Tumkur"],
      Mysore: ["Mysore City", "Mandya", "Hassan", "Kodagu"],
      Hubli: ["Hubli-Dharwad", "Gadag", "Haveri", "Uttara Kannada"],
      Mangalore: ["Dakshina Kannada", "Udupu", "Kasaragod", "Chikmagalur"],
      Belgaum: ["Belgaum City", "Bagalkot", "Bijapur", "Gulbarga"],
    },
  },
  PB: {
    name: "Punjab",
    districts: {
      Ludhiana: ["Ludhiana City", "Khanna", "Samrala", "Payal"],
      Amritsar: ["Amritsar City", "Tarn Taran", "Gurdaspur", "Pathankot"],
      Jalandhar: ["Jalandhar City", "Kapurthala", "Hoshiarpur", "Nawanshahr"],
      Patiala: ["Patiala City", "Rajpura", "Samana", "Patran"],
      Bathinda: ["Bathinda City", "Mansa", "Sardulgarh", "Rampura"],
    },
  },
  UP: {
    name: "Uttar Pradesh",
    districts: {
      Lucknow: ["Lucknow City", "Barabanki", "Sitapur", "Hardoi"],
      Kanpur: ["Kanpur City", "Kanpur Dehat", "Unnao", "Fatehpur"],
      Agra: ["Agra City", "Mathura", "Firozabad", "Mainpuri"],
      Varanasi: ["Varanasi City", "Jaunpur", "Ghazipur", "Ballia"],
      Allahabad: ["Prayagraj", "Kaushambi", "Pratapgarh", "Sultanpur"],
      Meerut: ["Meerut City", "Ghaziabad", "Gautam Buddha Nagar", "Bulandshahr"],
    },
  },
};

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { login, register, isAuthenticated, user } = useAuth();
  const { translations: t, setCurrentLang } = useLanguage();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobileNumber(value);
      setError(null);
    }
  };

  const validateMobileNumber = (num: string) => /^\d{10}$/.test(num);

  const mapDbUserToAppUser = (dbUser: any): User => ({
    id: dbUser.id,
    mobileNumber: dbUser.mobile_number,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    state: dbUser.state,
    district: dbUser.district,
    taluka: dbUser.taluka,
    village: dbUser.village,
    language: dbUser.language,
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateMobileNumber(mobileNumber)) {
      setError(t.loginPage.invalidMobile);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError(data.error);
          setIsSignUp(true);
          setStep("mobile");
          return;
        }
        throw new Error(data.error || "Failed to send OTP.");
      }

      toast({ title: t.loginPage.toastOtpSentTitle, description: t.loginPage.toastOtpSentDesc });
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError(t.loginPage.invalidOtp);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");

      login(mapDbUserToAppUser(data));
      toast({ title: t.loginPage.loginSuccess });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!firstName || !lastName || !mobileNumber || !selectedState || !selectedDistrict || !selectedTaluka || !selectedVillage || !selectedLanguage) {
      setError(t.loginPage.fillAllFields);
      return;
    }
    if (!validateMobileNumber(mobileNumber)) {
      setError(t.loginPage.invalidMobile);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber,
          firstName,
          lastName,
          state: locationData[selectedState].name,
          district: selectedDistrict,
          taluka: selectedTaluka,
          village: selectedVillage,
          language: selectedLanguage,
          isSignUp: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign up failed.");

      setCurrentLang(selectedLanguage);
      register(mapDbUserToAppUser(data));
      toast({ title: t.loginPage.signupSuccess });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDistricts = () => (selectedState ? Object.keys(locationData[selectedState].districts) : []);
  const getTalukas = () => (selectedState && selectedDistrict ? locationData[selectedState].districts[selectedDistrict] : []);
  const getVillages = () => (selectedState && selectedDistrict && selectedTaluka ? [selectedTaluka] : []);

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिंदी" },
    { value: "mr", label: "मराठी" },
    { value: "pa", label: "ਪੰਜਾਬੀ" },
    { value: "kn", label: "ಕನ್ನಡ" },
    { value: "ta", label: "தமிழ்" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 container-padding py-8">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-card/80 backdrop-blur-md animate-fade-in">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-lg">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl md:text-4xl font-bold gradient-text text-balance">
              {isSignUp ? t.loginPage.signup : t.loginPage.login}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground text-pretty max-w-md mx-auto">
              {t.loginPage.loginDescription}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-0 bg-destructive/10">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-base font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-base font-semibold">
                    {t.loginPage.firstName}
                  </Label>
                  <Input id="firstName" placeholder={t.loginPage.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-12 text-base rounded-xl border-2 focus:border-primary" required />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-base font-semibold">
                    {t.loginPage.lastName}
                  </Label>
                  <Input id="lastName" placeholder={t.loginPage.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-12 text-base rounded-xl border-2 focus:border-primary" required />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="mobileNumber" className="text-base font-semibold">
                  {t.loginPage.mobileNumber}
                </Label>
                <Input id="mobileNumber" type="tel" placeholder="9876543210" value={mobileNumber} onChange={handleMobileNumberChange} maxLength={10} className="h-12 text-base rounded-xl border-2 focus:border-primary" required />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="language" className="text-base font-semibold">
                  {t.selectLanguage}
                </Label>
                <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
                  <SelectTrigger className="h-12 text-base rounded-xl border-2">
                    <Globe className="h-5 w-5 mr-3 text-muted-foreground" />
                    <SelectValue placeholder={t.selectLanguage} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-base py-3">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="state" className="text-base font-semibold">{t.loginPage.selectState}</Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="h-12 text-base rounded-xl border-2">
                      <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                      <SelectValue placeholder={t.loginPage.selectState} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.entries(locationData).map(([code, data]) => (<SelectItem key={code} value={code} className="text-base py-3">{data.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="district" className="text-base font-semibold">{t.loginPage.selectDistrict}</Label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedState}>
                    <SelectTrigger className="h-12 text-base rounded-xl border-2">
                      <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                      <SelectValue placeholder={t.loginPage.selectDistrict} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {getDistricts().map((district) => (<SelectItem key={district} value={district} className="text-base py-3">{district}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="taluka" className="text-base font-semibold">{t.loginPage.selectTaluka}</Label>
                  <Select value={selectedTaluka} onValueChange={setSelectedTaluka} disabled={!selectedDistrict}>
                    <SelectTrigger className="h-12 text-base rounded-xl border-2">
                      <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                      <SelectValue placeholder={t.loginPage.selectTaluka} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {getTalukas().map((taluka) => (<SelectItem key={taluka} value={taluka} className="text-base py-3">{taluka}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="village" className="text-base font-semibold">{t.loginPage.selectVillage}</Label>
                  <Select value={selectedVillage} onValueChange={setSelectedVillage} disabled={!selectedTaluka}>
                    <SelectTrigger className="h-12 text-base rounded-xl border-2">
                      <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                      <SelectValue placeholder={t.loginPage.selectVillage} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {getVillages().map((village) => (<SelectItem key={village} value={village} className="text-base py-3">{village}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-semibold rounded-2xl" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : <UserPlus className="mr-3 h-5 w-5" />}
                {isLoading ? t.loginPage.registering : t.loginPage.register}
              </Button>
              <div className="text-center pt-4">
                <p className="text-base text-muted-foreground">
                  {t.loginPage.alreadyHaveAccount}{" "}
                  <Button variant="link" onClick={() => { setIsSignUp(false); setError(null); }} className="p-0 h-auto text-base font-semibold text-primary hover:text-primary/80">
                    {t.loginPage.login}
                  </Button>
                </p>
              </div>
            </form>
          ) : step === "mobile" ? (
            <form onSubmit={handleSendOtp} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="mobileNumber" className="text-base font-semibold">{t.loginPage.mobileNumber}</Label>
                <Input id="mobileNumber" type="tel" placeholder="9876543210" value={mobileNumber} onChange={handleMobileNumberChange} maxLength={10} className="h-12 text-base rounded-xl" required />
              </div>
              <Button type="submit" className="w-full h-14 text-lg font-semibold rounded-2xl" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : <LogIn className="mr-3 h-5 w-5" />}
                {isLoading ? t.loginPage.sendingOtp : t.loginPage.sendOtp}
              </Button>
              <div className="text-center pt-4">
                <p className="text-base text-muted-foreground">
                  {t.loginPage.dontHaveAccount}{" "}
                  <Button variant="link" onClick={() => { setIsSignUp(true); setError(null); }} className="p-0 h-auto text-base font-semibold text-primary">
                    {t.loginPage.signup}
                  </Button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-8">
              <div className="space-y-3 flex flex-col items-center">
                <Label htmlFor="otp" className="text-base font-semibold text-center">
                  {t.loginPage.otpSentTo(mobileNumber)}
                </Label>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} /> <InputOTPSlot index={1} /> <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} /> <InputOTPSlot index={4} /> <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full h-14 text-lg font-semibold rounded-2xl" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : <LogIn className="mr-3 h-5 w-5" />}
                {isLoading ? t.loginPage.verifying : t.loginPage.verifyOtp}
              </Button>
              <div className="text-center pt-4">
                <Button variant="link" onClick={() => { setStep("mobile"); setError(null); setOtp(""); }} className="text-base">
                  {t.loginPage.changeMobile}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}