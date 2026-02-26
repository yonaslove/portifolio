import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Navigation, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { personalInfo } from "@/data/portfolio";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters")
});

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationInfo, setLocationInfo] = useState<{
    address: string;
    lat: number;
    lon: number;
    mapUrl: string;
  } | null>(null);

  const handleLocateMe = async () => {
    setIsLocating(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Using OSM Nominatim API for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'Accept-Language': 'en-US,en;q=0.9',
                }
              }
            );

            if (!response.ok) throw new Error('Failed to fetch address');

            const data = await response.json();
            const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

            setLocationInfo({
              address,
              lat: latitude,
              lon: longitude,
              mapUrl
            });

            toast({
              title: "Location Identified",
              description: "Found your street address and mapped the coordinates.",
            });
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            // Fallback to just coordinates if geocoding fails
            setLocationInfo({
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              lat: latitude,
              lon: longitude,
              mapUrl: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
            });

            toast({
              title: "Coordinates Found",
              description: `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`,
            });
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive",
          });
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = contactSchema.parse(formData);

      // Prepare data for submission - append location if available
      const submissionData = { ...validatedData };
      if (locationInfo) {
        submissionData.message = `${validatedData.message}\n\n--- Shared Location ---\nAddress: ${locationInfo.address}\nCoordinates: ${locationInfo.lat}, ${locationInfo.lon}\nGoogle Maps: ${locationInfo.mapUrl}`;
      }

      console.log("Sending contact form:", submissionData);
      let sent = false;

      // 1. Try Vercel/Local API first (uses SMTP configured in .env)
      try {
        const resp = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        });

        if (resp.ok) {
          sent = true;
          console.log('Email sent via API (Vercel/Local)');
        } else {
          const errData = await resp.json().catch(() => ({}));
          console.error('API delivery failed:', errData);
        }
      } catch (apiErr) {
        console.warn('API call failed, trying Supabase fallback...', apiErr);
      }

      // 2. Fallback to Supabase Edge Function if above fails
      if (!sent) {
        try {
          const { data, error } = await supabase.functions.invoke('send-contact-email', {
            body: submissionData
          });

          if (!error && data && (data as any).success) {
            sent = true;
            console.log('Email sent via Supabase fallback');
          }
        } catch (fnErr) {
          console.warn('Supabase fallback failed:', fnErr);
        }
      }

      if (sent) {
        toast({
          title: "Message Sent! 🎉",
          description: "Thanks for reaching out! I'll get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        // 3. Ultimate Fallback: Direct Mail Client
        console.warn('All automated methods failed. Falling back to mailto.');

        toast({
          title: "Directing to Email",
          description: "Automated delivery busy. Opening your mail client...",
        });

        const subject = encodeURIComponent(`Portfolio Contact: ${validatedData.name}`);
        const body = encodeURIComponent(submissionData.message);
        window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;

        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        // Try to extract a useful backend error message if present
        let errMsg = "Failed to send message. Please try again.";
        try {
          const e: any = error;
          if (e?.message) errMsg = String(e.message);
          else if (e?.error) errMsg = String(e.error);
          else if (e?.response && typeof e.response === 'object') {
            // axios-like error
            errMsg = String(e.response.data?.error || e.response.data || JSON.stringify(e.response.data));
          }
        } catch (extractErr) {
          console.warn('Error extracting message from exception', extractErr);
        }

        toast({
          title: "Error",
          description: errMsg,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Have a project in mind? Let's work together to create something amazing
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="animate-fade-in-up">
              <h3 className="text-2xl font-bold mb-6 gradient-text">Let's Connect</h3>
              <p className="text-foreground/70 mb-8">
                I'm always interested in hearing about new projects and opportunities.
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>
            </div>

            <div className="space-y-4">
              <div className="glass p-4 rounded-lg flex items-center gap-4 hover-scale animate-fade-in-up">
                <div className="glass-strong p-3 rounded-full">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div
                className="glass p-4 rounded-lg flex items-center gap-4 hover-scale animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="glass-strong p-3 rounded-full">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <a
                    href={`tel:${personalInfo.phone.replace(/\s/g, '')}`}
                    className="text-foreground/70 hover:text-secondary transition-colors"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <div
                className="glass p-4 rounded-lg flex items-center gap-4 hover-scale animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="glass-strong p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-foreground/70">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            {/* Location Button */}
            <div className="animate-fade-in-up mt-8" style={{ animationDelay: "0.3s" }}>
              <Button
                onClick={handleLocateMe}
                disabled={isLocating}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <Navigation className={`w-5 h-5 mr-2 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? "Locating..." : "Show My Current Location"}
              </Button>

              {/* Display Found Location Details */}
              {locationInfo && (
                <div className="mt-6 glass-strong p-5 rounded-xl animate-fade-in-up border border-primary/20 shadow-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Location Found</h4>
                      <p className="text-sm text-foreground/80 leading-relaxed mt-1">
                        {locationInfo.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                    <div className="flex justify-between text-xs text-foreground/50">
                      <span>Latitude: {locationInfo.lat.toFixed(6)}</span>
                      <span>Longitude: {locationInfo.lon.toFixed(6)}</span>
                    </div>
                    <Button
                      variant="link"
                      className="text-primary hover:text-primary/80 p-0 h-auto justify-start text-sm flex items-center gap-1 group"
                      onClick={() => window.open(locationInfo.mapUrl, "_blank")}
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-strong p-8 rounded-lg animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="bg-background/50 border-primary/30 focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="bg-background/50 border-primary/30 focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  rows={5}
                  required
                  className="bg-background/50 border-primary/30 focus:border-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-cyan"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
