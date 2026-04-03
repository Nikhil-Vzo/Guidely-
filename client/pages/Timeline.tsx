import * as React from "react";
import { useState, useEffect } from "react";
import { CheckCircle2, School } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define a more detailed type to match our database table
type TimelineEvent = {
  id: number;
  title: string;
  start_date: string | null;
  end_date: string | null;
  message: string;
  target_colleges: string[] | null; // This is a JSON array of strings
};

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimelineEvents() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.from("timelines").select("*").order("created_at", { ascending: true });
        if (error) {
          console.error("Error fetching timelines:", error.message);
        } else {
          setEvents(data || []);
        }
      } catch (err) {
         console.error("Error fetching timelines:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTimelineEvents();
  }, []);

  if (loading) {
    return <div className="container py-10 text-center">Loading timeline...</div>;
  }

  return (
    <section className="container py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Admissions & Scholarship Timeline
        </h1>
        <p className="mt-2 text-muted-foreground">
          Key dates and milestones to guide you through the admission process.
        </p>
      </header>

      {events.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No timeline events have been added yet. Check back soon!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="flex h-full flex-col border-0 bg-white/70 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  {/* --- CHANGE 1: Display date range --- */}
                  <span>
                    {event.start_date}
                    {event.end_date && ` - ${event.end_date}`}
                  </span>
                </div>
                <CardTitle className="pt-2 text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="text-sm text-muted-foreground">
                  {event.message}
                </p>
                
                <div className="flex-1" /> {/* Spacer */}

                {/* --- CHANGE 2: Display target colleges --- */}
                {event.target_colleges && event.target_colleges.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <School className="h-3 w-3" />
                      APPLIES TO
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.target_colleges.map((college) => (
                        <span
                          key={college}
                          className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                        >
                          {college}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}