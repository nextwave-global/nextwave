export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string | null;
  quote: string;
  event?: string;
  rating?: number; // 1-5
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Amoo Covenant",
    role: "Undergraduate, University of Lagos",
    quote:
      "Scholar Reboot completely changed how I approach my studies. I went from barely passing to topping my class in one semester. The strategies were practical and easy to apply.",
    event: "Scholar Reboot",
    rating: 5,
  },
  {
    id: "t2",
    name: "Okewoye Unique",
    role: "Final year student",
    quote:
      "Campus2LinkedIn gave me the exact playbook I needed. Within 3 weeks of applying what I learned, I had two internship offers on LinkedIn. This community is the real deal.",
    event: "Campus2LinkedIn",
    rating: 5,
  },
  {
    id: "t3",
    name: "Temiloluwa Gboyega",
    role: "Aspiring Frontend Developer",
    quote:
      "I was stuck in tutorial hell. 'Starting Tech with Limited Resources' taught me to just ship. I built my first real project in a week and landed my first freelance gig a month later.",
    event: "Starting Tech with Limited Resources",
    rating: 5,
  },
  {
    id: "t4",
    name: "Bliss Eniobayan",
    role: "Content Creator",
    quote:
      "Every NextWave event I attend leaves me with at least one action I can take immediately. No fluff, no theory — just things that actually move the needle.",
    event: "NextWave Events",
    rating: 5,
  },
  {
    id: "t5",
    name: "Ogunsakin Tobiloba",
    role: "Engineering Student",
    quote:
      "The community aspect is what makes NextWave special. You're surrounded by people who genuinely want to grow, and that energy pushes you forward.",
    event: "Scholar Reboot",
    rating: 5,
  },
  {
    id: "t6",
    name: "Adefuye Oreoluwa",
    role: "Pre-med Student",
    quote:
      "I came in thinking I already knew how to study. I left with a completely new framework that helped me balance academics, side projects, and my mental health.",
    event: "Scholar Reboot",
    rating: 5,
  },
];
