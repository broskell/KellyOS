import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Contact form. Submissions are meant to go to the site's own backend (the
 * existing Fastify/Mongo CMS) — NOT to email. The real POST is deferred to the
 * CMS phase; `submitMessage` is the single seam to wire it up. Until then it
 * validates and acknowledges locally so the UI is complete.
 */
async function submitMessage(_payload: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  // TODO(cms): POST _payload to the backend messages endpoint, e.g.
  //   await fetch("/v1/messages", {
  //     method: "POST",
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify(_payload),
  //   });
  // For now, resolve after a short beat so the "sending" state is visible.
  await new Promise((r) => setTimeout(r, 550));
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    if (!name.trim() || !emailValue.trim() || !message.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      await submitMessage({
        name: name.trim(),
        email: emailValue.trim(),
        message: message.trim(),
      });
      setStatus("sent");
      setName("");
      setEmailValue("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const onEdit =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
      if (status === "error" || status === "sent") setStatus("idle");
    };

  const statusMessage =
    status === "sent"
      ? "Thanks — your message is on its way. I'll reply soon."
      : status === "error"
        ? "Please fill in your name, email, and message."
        : "";

  return (
    <form className="t26-cform" onSubmit={handleSubmit} noValidate>
      <div className="t26-cform__intro">
        <h3 className="t26-cform__title">Send a message</h3>
        <p className="t26-cform__hint">I usually reply within a day.</p>
      </div>

      <div className="t26-cform__field">
        <label className="t26-cform__label" htmlFor="cf-name">
          Name
        </label>
        <input
          id="cf-name"
          className="t26-cform__input"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={onEdit(setName)}
          required
        />
      </div>

      <div className="t26-cform__field">
        <label className="t26-cform__label" htmlFor="cf-email">
          Email
        </label>
        <input
          id="cf-email"
          className="t26-cform__input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={emailValue}
          onChange={onEdit(setEmailValue)}
          required
        />
      </div>

      <div className="t26-cform__field">
        <label className="t26-cform__label" htmlFor="cf-message">
          Message
        </label>
        <textarea
          id="cf-message"
          className="t26-cform__input t26-cform__textarea"
          name="message"
          rows={4}
          placeholder="Tell me about your idea, role, or project…"
          value={message}
          onChange={onEdit(setMessage)}
          required
        />
      </div>

      <div className="t26-cform__foot">
        <button
          type="submit"
          className="t26-cform__submit"
          disabled={status === "sending"}
        >
          <span>{status === "sending" ? "Sending…" : "Send message"}</span>
          <svg
            className="t26-cform__arrow"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <p
          className="t26-cform__status"
          role="status"
          aria-live="polite"
          data-state={status}
        >
          {statusMessage}
        </p>
      </div>
    </form>
  );
}
