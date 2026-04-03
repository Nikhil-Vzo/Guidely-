import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const resources = [
  {
    id: "1", category: "Study Materials",
    title: "NCERT Books (Class 11 & 12)",
    description: "Free official NCERT textbooks for all streams — Science, Commerce, Arts.",
    format: "PDF", language: "Hindi / English",
    tags: ["NCERT", "Class 12", "All Streams"],
    link: "https://ncert.nic.in/textbook.php",
  },
  {
    id: "2", category: "Study Materials",
    title: "Khan Academy India",
    description: "Free video lessons on Math, Science, Finance, and Computer Science.",
    format: "Video", language: "English / Hindi",
    tags: ["Video", "Free", "Self-paced"],
    link: "https://www.khanacademy.org/",
  },
  {
    id: "3", category: "Study Materials",
    title: "DIKSHA Platform",
    description: "Government e-learning portal with textbooks, courses, and teacher resources.",
    format: "Web / App", language: "Hindi + Regional",
    tags: ["Govt", "e-Learning", "Free"],
    link: "https://diksha.gov.in/",
  },
  {
    id: "4", category: "Scholarships",
    title: "NSP — National Scholarship Portal",
    description: "Central hub for all central and state government scholarship schemes for students.",
    format: "Web", language: "Hindi / English",
    tags: ["Scholarship", "Govt", "All Classes"],
    link: "https://scholarships.gov.in/",
  },
  {
    id: "5", category: "Scholarships",
    title: "CG Scholarship Portal",
    description: "Chhattisgarh state scholarships for SC/ST/OBC and meritorious students.",
    format: "Web", language: "Hindi",
    tags: ["Chhattisgarh", "SC/ST/OBC", "State"],
    link: "https://schoolscholarship.cg.nic.in/",
  },
  {
    id: "6", category: "Career Guidance",
    title: "UDAAN — CBSE Career Guidance",
    description: "Free engineering entrance coaching for girls from SC/ST backgrounds.",
    format: "PDF + Video", language: "English",
    tags: ["Girls", "Engineering", "Free Coaching"],
    link: "https://udaanproject.org/",
  },
  {
    id: "7", category: "Career Guidance",
    title: "Skill India — PMKVY",
    description: "Government skill certification courses across 300+ job roles. Free training.",
    format: "Course", language: "Hindi / English",
    tags: ["Vocational", "Certificate", "Free"],
    link: "https://www.skillindia.gov.in/",
  },
  {
    id: "8", category: "Exam Prep",
    title: "Unacademy Free Courses",
    description: "Free UPSC, SSC, Bank PO, NEET & JEE prep videos from top educators.",
    format: "Video", language: "Hindi / English",
    tags: ["UPSC", "SSC", "NEET", "JEE"],
    link: "https://unacademy.com/",
  },
  {
    id: "9", category: "Exam Prep",
    title: "BYJU's Free Classes",
    description: "Free chapter-wise videos and practice questions for Class 8–12.",
    format: "Video", language: "English",
    tags: ["Class 12", "NEET", "JEE"],
    link: "https://byjus.com/free-videos/",
  },
];

export default function Resources() {
  const categories = Array.from(new Set(resources.map((r) => r.category)));
  return (
    <section className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Resources &amp; Scholarships
        </h1>
        <p className="mt-3 text-muted-foreground">
          Open-access study materials, scholarships and helpful links.
        </p>
      </header>

      {categories.map((cat) => (
        <div key={cat} className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">{cat}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((r) => r.category === cat)
              .map((r) => (
                <Card key={r.id} className="border-0 bg-white/80 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">{r.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{r.format}</span>
                      <span className="rounded-full bg-secondary px-2 py-1">{r.language}</span>
                      {r.tags.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-full bg-accent px-2 py-1">{t}</span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button asChild className="rounded-full">
                        <a href={r.link} target="_blank" rel="noreferrer">Open</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
