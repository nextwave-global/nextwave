export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "link" | "document";
  category: string;
  url: string;
  thumbnail?: string;
  date: string;
}

export const LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: "1",
    title: "The Art of Laziness",
    description: "Overcoming procrastination and boosting your productivity.",
    type: "pdf",
    category: "Productivity",
    url: "https://drive.google.com/file/d/1tS5_uWR-DeQO4-RM55kW8rbvAXRpJyH1/view?usp=drive_link",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "Sell or Be Sold",
    description: "Grant Cardone's guide to the art of selling.",
    type: "pdf",
    category: "Sales",
    url: "https://drive.google.com/file/d/1sFqjJlV7punrrvrIc4VpQK_8VoFkxIKg/view?usp=drive_link",
    date: "2024-02-01",
  },
  {
    id: "3",
    title: "TED Talks - The Official Guide",
    description: "The official TED guide to public speaking.",
    type: "pdf",
    category: "Communication",
    url: "https://drive.google.com/file/d/1DOW-YolKHKb9-WEdDj9bkD6vJUXt2mHY/view?usp=drive_link",
    date: "2024-02-15",
  },
  {
    id: "4",
    title: "The Millionaire Fastlane",
    description: "A roadmap to wealth and financial independence.",
    type: "pdf",
    category: "Wealth",
    url: "https://drive.google.com/file/d/1sPiHLwTVO_4r_ZlRPLx5iVN7z4YLctKR/view?usp=drive_link",
    date: "2024-03-01",
  },
  {
    id: "5",
    title: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness.",
    type: "pdf",
    category: "Finance",
    url: "https://drive.google.com/file/d/1Td9W2xLneZAao51uUR_cDa5SEeQBdBUW/view?usp=drive_link",
    date: "2024-03-15",
  },
  {
    id: "6",
    title: "Think Again",
    description: "The power of knowing what you don't know.",
    type: "pdf",
    category: "Mindset",
    url: "https://drive.google.com/file/d/1eBRi-oakiHNnsXpu80S0Ya8sv3gdCDL5/view?usp=drive_link",
    date: "2024-04-01",
  },
  {
    id: "7",
    title: "Surrounded by Idiots",
    description: "Understanding the four types of human behavior.",
    type: "pdf",
    category: "Psychology",
    url: "https://drive.google.com/file/d/1ObKm46HSZAX9YEIdh2IaV-aKVeomajj2/view?usp=drive_link",
    date: "2024-04-15",
  },
  {
    id: "8",
    title: "Why We Want You to Be Rich",
    description: "Financial strategies for creating abundance.",
    type: "pdf",
    category: "Wealth",
    url: "https://drive.google.com/file/d/1M50PHs1S450CMexUr5iaYAprgM1YvMou/view?usp=drive_link",
    date: "2024-05-01",
  },
  {
    id: "9",
    title: "Zero to One",
    description: "Notes on startups, or how to build the future.",
    type: "pdf",
    category: "Entrepreneurship",
    url: "https://drive.google.com/file/d/18lDB6feY5x9bQctNYfUguGdiygH6G_wN/view?usp=drive_link",
    date: "2024-05-15",
  },
  {
    id: "10",
    title: "Never Split the Difference",
    description: "Key principles and tactics for high-stakes negotiation.",
    type: "pdf",
    category: "Negotiation",
    url: "https://drive.google.com/file/d/12SNIgnIULrJsfXmjcO_4mafpG_3cJpV0/view?usp=drive_link",
    date: "2024-05-15",
  },
];
