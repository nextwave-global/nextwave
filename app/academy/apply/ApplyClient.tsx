"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Loader2,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Sparkles,
  Target,
  Wallet,
  X,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  TRACKS,
  PAYMENT_LABELS,
  CLASS_VIBE_LABELS,
} from "@/lib/applications";
import type {
  ApplicationTrack,
  PaymentCapacity,
  OpenToPaid,
  ClassVibe,
} from "@/types/db";

type FormState = {
  // P1
  track: ApplicationTrack | "";
  // P2
  fullName: string;
  whatsapp: string;
  email: string;
  school: string;
  level: string;
  // P3
  hasLinkedin: boolean | null;
  linkedinUrl: string;
  isSocialActive: boolean | null;
  hasPriorSkill: boolean | null;
  priorSkillName: string;
  earnsFromSkill: boolean | null;
  // P4
  goal: string;
  readyToCommit: boolean | null;
  openToPaid: OpenToPaid | "";
  classVibe: ClassVibe | "";
  // P5
  paymentCapacity: PaymentCapacity | "";
};

const INITIAL: FormState = {
  track: "",
  fullName: "",
  whatsapp: "",
  email: "",
  school: "",
  level: "",
  hasLinkedin: null,
  linkedinUrl: "",
  isSocialActive: null,
  hasPriorSkill: null,
  priorSkillName: "",
  earnsFromSkill: null,
  goal: "",
  readyToCommit: null,
  openToPaid: "",
  classVibe: "",
  paymentCapacity: "",
};

const STEPS = [
  { id: 1, label: "Track" },
  { id: 2, label: "About You" },
  { id: 3, label: "Experience" },
  { id: 4, label: "Goals" },
  { id: 5, label: "Investment" },
];

export default function ApplyClient() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!form.track;
      case 2:
        return (
          form.fullName.trim().length >= 2 &&
          form.whatsapp.replace(/\D/g, "").length >= 7 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
          form.school.trim().length >= 2 &&
          form.level.trim().length >= 1
        );
      case 3:
        return (
          form.hasLinkedin !== null &&
          (form.hasLinkedin === false || form.linkedinUrl.trim().length > 3) &&
          form.isSocialActive !== null &&
          form.hasPriorSkill !== null &&
          (form.hasPriorSkill === false ||
            form.priorSkillName.trim().length > 1) &&
          form.earnsFromSkill !== null
        );
      case 4:
        return (
          form.goal.trim().length >= 5 &&
          form.readyToCommit !== null &&
          form.openToPaid !== "" &&
          form.classVibe !== ""
        );
      case 5:
        return form.paymentCapacity !== "";
      default:
        return false;
    }
  };

  const next = () => {
    if (!canProceed()) return;
    setStep((s) => Math.min(5, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!canProceed()) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/academy/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("success");
      setMessage(data.message || "Application received!");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <main className="min-h-screen bg-[#0d0d0d]">
        <Navbar />
        <section className="pt-32 pb-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center bg-[#1a1a1a] rounded-2xl border border-[#c9a84c]/30 p-8 md:p-12"
          >
            <div className="bg-[#c9a84c]/10 p-5 rounded-full inline-flex mb-6 border border-[#c9a84c]/20">
              <CheckCircle className="w-14 h-14 text-[#c9a84c]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              You&apos;re in! 🎉
            </h1>
            <p className="text-[#b8b0a8] mb-8">{message}</p>

            <div className="bg-[#0d0d0d] border border-[#333333] rounded-xl p-5 text-left mb-6">
              <p className="text-xs uppercase tracking-widest text-[#7a7270] font-semibold mb-2">
                Track
              </p>
              <p className="text-white font-bold text-lg">
                {form.track && TRACKS.find((t) => t.id === form.track)?.label}
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/academy"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-full transition-all touch-manipulation"
              >
                Back to Academy
              </Link>
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0d0d0d] hover:bg-[#2a2a2a] border border-[#333333] text-[#b8b0a8] font-semibold rounded-full transition-all touch-manipulation"
              >
                Return Home
              </Link>
            </div>
          </motion.div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <Navbar />

      <section className="pt-24 md:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest bg-[#c9a84c]/10 px-4 py-2 rounded-full mb-4 border border-[#c9a84c]/20">
              <Sparkles className="w-4 h-4" />
              <span>Free Class Application</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Apply for the <span className="text-[#c9a84c]">Free Class</span>
            </h1>
            <p className="text-[#7a7270] text-sm md:text-base">
              5 quick steps. Takes about 90 seconds.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col items-center flex-1 relative"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                      step > s.id
                        ? "bg-[#c9a84c] text-[#0d0d0d]"
                        : step === s.id
                          ? "bg-[#c9a84c] text-[#0d0d0d] ring-4 ring-[#c9a84c]/20"
                          : "bg-[#1a1a1a] text-[#7a7270] border border-[#333333]"
                    }`}
                  >
                    {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <span
                    className={`hidden sm:block text-[10px] uppercase tracking-wider mt-2 font-semibold ${
                      step >= s.id ? "text-[#c9a84c]" : "text-[#7a7270]"
                    }`}
                  >
                    {s.label}
                  </span>
                  {s.id < 5 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-0.5 ${
                        step > s.id ? "bg-[#c9a84c]" : "bg-[#333333]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333333] p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 1 && <Step1 form={form} set={set} />}
                {step === 2 && <Step2 form={form} set={set} />}
                {step === 3 && <Step3 form={form} set={set} />}
                {step === 4 && <Step4 form={form} set={set} />}
                {step === 5 && <Step5 form={form} set={set} />}
              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="mt-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Nav */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#333333] gap-3">
              <button
                type="button"
                onClick={back}
                disabled={step === 1}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#0d0d0d] hover:bg-[#2a2a2a] border border-[#333333] text-[#b8b0a8] font-semibold rounded-xl text-sm transition disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canProceed()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-xl text-sm transition disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canProceed() || status === "loading"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-xl text-sm transition disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ============ Shared UI ============
const inputClass =
  "w-full px-4 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm";
const labelClass =
  "block text-xs font-semibold text-[#b8b0a8] mb-2 uppercase tracking-wider";

function YesNo({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`py-3 rounded-xl text-sm font-semibold transition border ${
          value === true
            ? "bg-[#c9a84c] text-[#0d0d0d] border-[#c9a84c]"
            : "bg-[#0d0d0d] text-[#b8b0a8] border-[#333333] hover:border-[#c9a84c]/50"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`py-3 rounded-xl text-sm font-semibold transition border ${
          value === false
            ? "bg-[#c9a84c] text-[#0d0d0d] border-[#c9a84c]"
            : "bg-[#0d0d0d] text-[#b8b0a8] border-[#333333] hover:border-[#c9a84c]/50"
        }`}
      >
        No
      </button>
    </div>
  );
}

// ============ Steps ============
type StepProps = {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

function Step1({ form, set }: StepProps) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
        Which skill are you going for?
      </h2>
      <p className="text-sm text-[#7a7270] mb-6">
        Pick the one you want to learn. You can only pick one.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {TRACKS.map((t) => {
          const selected = form.track === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => set("track", t.id)}
              className={`text-left p-4 rounded-xl border transition-all touch-manipulation ${
                selected
                  ? "bg-[#c9a84c]/10 border-[#c9a84c] shadow-lg shadow-[#c9a84c]/10"
                  : "bg-[#0d0d0d] border-[#333333] hover:border-[#c9a84c]/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-2xl">{t.emoji}</span>
                <span
                  className={`font-bold text-sm ${
                    selected ? "text-[#c9a84c]" : "text-white"
                  }`}
                >
                  {t.label}
                </span>
                {selected && (
                  <CheckCircle className="w-4 h-4 text-[#c9a84c] ml-auto" />
                )}
              </div>
              <p className="text-xs text-[#7a7270] leading-relaxed">
                {t.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({ form, set }: StepProps) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
        Tell us about you
      </h2>
      <p className="text-sm text-[#7a7270] mb-6">
        We&apos;ll use this to reach out with class details.
      </p>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]" />
            <input
              type="text"
              className={`${inputClass} pl-10`}
              placeholder="Your full name"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>WhatsApp Number *</label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]" />
            <input
              type="tel"
              className={`${inputClass} pl-10`}
              placeholder="+234 800 000 0000"
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
            />
          </div>
          <p className="text-[10px] text-[#7a7270] mt-1.5">
            Include country code (e.g. +234, +1, +44)
          </p>
        </div>

        <div>
          <label className={labelClass}>Email Address *</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]" />
            <input
              type="email"
              className={`${inputClass} pl-10`}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>School / Institution *</label>
          <div className="relative">
            <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]" />
            <input
              type="text"
              className={`${inputClass} pl-10`}
              placeholder="University of Lagos"
              value={form.school}
              onChange={(e) => set("school", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Level / Year of Study *</label>
          <div className="relative">
            <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]" />
            <input
              type="text"
              className={`${inputClass} pl-10`}
              placeholder="200 Level / Year 2"
              value={form.level}
              onChange={(e) => set("level", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3({ form, set }: StepProps) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
        Online visibility &amp; experience
      </h2>
      <p className="text-sm text-[#7a7270] mb-6">
        Helps us understand where you are right now.
      </p>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>
            Do you have a LinkedIn profile?
          </label>
          <YesNo
            value={form.hasLinkedin}
            onChange={(v) => set("hasLinkedin", v)}
          />
          <AnimatePresence>
            {form.hasLinkedin === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="relative mt-3">
                  <FaLinkedin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]" />
                  <input
                    type="url"
                    className={`${inputClass} pl-10`}
                    placeholder="https://linkedin.com/in/yourname"
                    value={form.linkedinUrl}
                    onChange={(e) => set("linkedinUrl", e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className={labelClass}>
            Are you active on social media?
          </label>
          <YesNo
            value={form.isSocialActive}
            onChange={(v) => set("isSocialActive", v)}
          />
        </div>

        <div>
          <label className={labelClass}>
            Have you learned a skill before?
          </label>
          <YesNo
            value={form.hasPriorSkill}
            onChange={(v) => set("hasPriorSkill", v)}
          />
          <AnimatePresence>
            {form.hasPriorSkill === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  className={`${inputClass} mt-3`}
                  placeholder="Which skill? (e.g. Graphic Design)"
                  value={form.priorSkillName}
                  onChange={(e) => set("priorSkillName", e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className={labelClass}>
            Do you currently earn from any skill?
          </label>
          <YesNo
            value={form.earnsFromSkill}
            onChange={(v) => set("earnsFromSkill", v)}
          />
        </div>
      </div>
    </div>
  );
}

function Step4({ form, set }: StepProps) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
        Your learning goals
      </h2>
      <p className="text-sm text-[#7a7270] mb-6">
        Be honest - this helps us tailor the class.
      </p>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>
            What do you want to achieve from this free class? *
          </label>
          <div className="relative">
            <Target className="w-4 h-4 absolute left-3 top-3 text-[#7a7270]" />
            <textarea
              rows={3}
              className={`${inputClass} pl-10`}
              placeholder="Ex: Learn the fundamentals of video editing so I can start freelancing"
              value={form.goal}
              onChange={(e) => set("goal", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Are you ready to commit 4 weeks to learning this skill? *
          </label>
          <YesNo
            value={form.readyToCommit}
            onChange={(v) => set("readyToCommit", v)}
          />
        </div>

        <div>
          <label className={labelClass}>
            Are you open to joining a paid program afterward if it&apos;s
            valuable? *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["yes", "maybe", "no"] as OpenToPaid[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set("openToPaid", opt)}
                className={`py-3 rounded-xl text-sm font-semibold capitalize transition border ${
                  form.openToPaid === opt
                    ? "bg-[#c9a84c] text-[#0d0d0d] border-[#c9a84c]"
                    : "bg-[#0d0d0d] text-[#b8b0a8] border-[#333333] hover:border-[#c9a84c]/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>
            What&apos;s your take on online classes? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(["love_it", "wont_keep_up"] as ClassVibe[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set("classVibe", opt)}
                className={`py-4 px-4 rounded-xl text-sm font-semibold transition border text-left flex items-center gap-2 ${
                  form.classVibe === opt
                    ? "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]"
                    : "bg-[#0d0d0d] text-[#b8b0a8] border-[#333333] hover:border-[#c9a84c]/50"
                }`}
              >
                {opt === "love_it" ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <X className="w-4 h-4 shrink-0" />
                )}
                {CLASS_VIBE_LABELS[opt]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step5({ form, set }: StepProps) {
  const options: PaymentCapacity[] = [
    "1k-3k",
    "3k-5k",
    "5k-10k",
    "10k_plus",
    "sponsorship",
  ];

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
        Investment capacity
      </h2>
      <p className="text-sm text-[#7a7270] mb-6">
        If the free class leads to a paid program, what could you comfortably
        invest? This helps us plan pricing and scholarships.
      </p>

      <div className="space-y-3">
        {options.map((opt) => {
          const selected = form.paymentCapacity === opt;
          const isSponsor = opt === "sponsorship";
          return (
            <button
              key={opt}
              type="button"
              onClick={() => set("paymentCapacity", opt)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 touch-manipulation ${
                selected
                  ? isSponsor
                    ? "bg-purple-500/10 border-purple-500/60"
                    : "bg-[#c9a84c]/10 border-[#c9a84c]"
                  : "bg-[#0d0d0d] border-[#333333] hover:border-[#c9a84c]/50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selected
                    ? isSponsor
                      ? "border-purple-500 bg-purple-500"
                      : "border-[#c9a84c] bg-[#c9a84c]"
                    : "border-[#555]"
                }`}
              >
                {selected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d]" />
                )}
              </div>
              <Wallet
                className={`w-4 h-4 shrink-0 ${
                  isSponsor ? "text-purple-400" : "text-[#c9a84c]"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  selected ? "text-white" : "text-[#b8b0a8]"
                }`}
              >
                {PAYMENT_LABELS[opt]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[#7a7270] mt-5 leading-relaxed">
        Choosing &quot;I need sponsorship&quot; doesn&apos;t disqualify you.
        We have limited slots for financial aid - we&apos;ll reach out
        separately.
      </p>
    </div>
  );
}
