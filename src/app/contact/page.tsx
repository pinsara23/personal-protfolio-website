"use client";
import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import profile from "@/data/profile.json";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type SubmissionStatus = "idle" | "sending" | "success" | "error";

const initialValues: FormValues = { name: "", email: "", subject: "", message: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getMailtoHref(values: FormValues) {
  const body = `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!values.subject.trim()) errors.subject = "Please enter a subject.";
  if (!values.message.trim()) errors.message = "Please enter a message.";
  else if (values.message.trim().length < 4) errors.message = "Please enter at least 4 characters.";
  else if (values.message.trim().length > 2000) errors.message = "Please keep your message under 2000 characters.";
  return errors;
}

export default function ContactPage() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds === 0) return;
    const timer = window.setInterval(() => {
      setCooldownSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending" || cooldownSeconds > 0) return;

    const formData = new FormData(event.currentTarget);
    if (formData.get("botcheck") === "on") {
      setValues(initialValues);
      setStatus("success");
      setStatusMessage("Thanks for reaching out. Your message has been received.");
      setCooldownSeconds(30);
      return;
    }

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setStatusMessage("Please review the highlighted fields.");
      return;
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY?.trim();
    if (!accessKey) {
      setStatus("error");
      setStatusMessage("Online delivery is not configured yet. Please email me directly instead.");
      return;
    }

    setStatus("sending");
    setStatusMessage("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          ...values,
          from_name: "Portfolio Contact",
          botcheck: formData.get("botcheck") === "on",
        }),
        signal: controller.signal,
      });
      const data = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || data.success !== true) {
        throw new Error(data.message || "The message could not be sent. Please email me directly instead.");
      }
      setValues(initialValues);
      setErrors({});
      setStatus("success");
      setStatusMessage("Thanks for reaching out. Your message has been sent.");
      setCooldownSeconds(30);
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof DOMException && error.name === "AbortError"
        ? "The request timed out. Please try again or email me directly instead."
        : error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or email me directly instead.");
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const sendAnother = () => {
    setStatus("idle");
    setStatusMessage("");
    setErrors({});
  };

  const mailtoHref = getMailtoHref(values);

  return <><section id="contact" className="page-hero"><div className="container"><div className="eyebrow">Contact</div><h1>Have a project in mind?</h1><p className="lead">Reach out by email or LinkedIn, or use the form below to send a message.</p></div></section><section className="section"><div className="container split"><div><h2>Start a conversation.</h2><p className="prose">Share a little context and I’ll have a better starting point. Your message is delivered securely through Web3Forms.</p><div className="actions">{profile.email && <a className="button primary" href={`mailto:${profile.email}`}>Email me</a>}{profile.linkedin && <a className="button" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}<a className="button" href={profile.github} target="_blank" rel="noreferrer">GitHub</a></div></div><div className="contact-box">
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? <motion.div key="success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2 }} aria-live="polite" className="contact-status"><div className="eyebrow">Message sent</div><h3>Thanks for reaching out.</h3><p className="prose">{statusMessage}</p><button className="button primary" type="button" onClick={sendAnother} disabled={cooldownSeconds > 0}>{cooldownSeconds > 0 ? `Send another message in ${cooldownSeconds}s` : "Send another message"}</button></motion.div> : <motion.form key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2 }} onSubmit={submit} className="form-grid" noValidate>
        <div className="field"><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" required autoComplete="name" value={values.name} onChange={(event) => updateValue("name", event.target.value)} className="input" aria-describedby={errors.name ? "contact-name-error" : undefined} aria-invalid={Boolean(errors.name)} />{errors.name && <span id="contact-name-error" className="field-error">{errors.name}</span>}</div>
        <div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" required type="email" autoComplete="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} className="input" aria-describedby={errors.email ? "contact-email-error" : undefined} aria-invalid={Boolean(errors.email)} />{errors.email && <span id="contact-email-error" className="field-error">{errors.email}</span>}</div>
        <div className="field form-full"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" required value={values.subject} onChange={(event) => updateValue("subject", event.target.value)} className="input" aria-describedby={errors.subject ? "contact-subject-error" : undefined} aria-invalid={Boolean(errors.subject)} />{errors.subject && <span id="contact-subject-error" className="field-error">{errors.subject}</span>}</div>
        <div className="field form-full"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" required minLength={10} maxLength={2000} value={values.message} onChange={(event) => updateValue("message", event.target.value)} className="input" aria-describedby={errors.message ? "contact-message-error" : "contact-message-help"} aria-invalid={Boolean(errors.message)} /><span id="contact-message-help" className="field-help">10–2000 characters</span>{errors.message && <span id="contact-message-error" className="field-error">{errors.message}</span>}</div>
        <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" className="contact-honeypot" />
        {status === "error" && <div className="form-full contact-error" role="alert" aria-live="polite"><span>{statusMessage}</span>{profile.email && <a className="text-link" href={mailtoHref}>Email me directly instead</a>}</div>}
        <button className="button primary form-full contact-submit" type="submit" disabled={status === "sending" || cooldownSeconds > 0}>{status === "sending" ? <><span className="contact-spinner" aria-hidden="true" /> Sending…</> : cooldownSeconds > 0 ? `Please wait ${cooldownSeconds}s` : "Send message"}</button>
      </motion.form>}
    </AnimatePresence>
  </div></div></section><style jsx>{`.contact-box label{display:block;color:var(--muted);font-family:"DM Mono",monospace;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:7px}.field{min-width:0}.field-error,.field-help{display:block;font-size:.75rem;line-height:1.4;margin-top:6px}.field-error{color:#ff9b9b}.field-help{color:var(--muted)}.contact-box .input:focus-visible,.contact-box button:focus-visible,.contact-box a:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}.contact-box .input[aria-invalid=true]{border-color:#ff9b9b}.contact-status{display:grid;gap:14px}.contact-status h3{font-size:1.5rem}.contact-status .prose{margin:0}.contact-error{display:grid;gap:8px;color:#ffb1b1;line-height:1.5}.contact-honeypot{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}.contact-submit{justify-content:center}.contact-spinner{width:15px;height:15px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:contact-spin .7s linear infinite}@keyframes contact-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.contact-spinner{animation:none}}`}</style></>;
}
