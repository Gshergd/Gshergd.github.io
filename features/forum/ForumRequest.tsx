"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { UniversalFooter, UniversalHeader } from "@/components/site/UniversalShell";
import { forumSendAnimation } from "./forumAnimations";

const FORMSUBMIT_URL = "https://formsubmit.co/dikshitaggarwal007@gmail.com";
const RETURN_URL = "https://gshergd.github.io/forum/?submitted=true";

export default function ForumRequest() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setSubmitted(new URLSearchParams(window.location.search).get("submitted") === "true");
  }, []);

  return (
    <main className="forum-page">
      <UniversalHeader />

      <section className="forum-layout" aria-labelledby="forum-title">
        <div className="forum-panel">
          <div className="forum-form-wrap">
            <p className="eyebrow">FORUM REQUEST // OPEN CHANNEL</p>
            <h1 id="forum-title">Start a conversation.</h1>
            <p className="forum-intro">Send the details once. I&apos;ll read the request, understand what you need, and continue the conversation directly.</p>

            {submitted ? (
              <div className="forum-success" role="status">
                <span aria-hidden="true">&#10003;</span>
                <div><strong>Request transmitted.</strong><p>Your message is in the archive. I&apos;ll get back to you as soon as I can.</p></div>
              </div>
            ) : (
              <form className="forum-form" action={FORMSUBMIT_URL} method="POST" onSubmit={() => setSending(true)}>
                <input type="hidden" name="_subject" value="New Portfolio Forum Request" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_next" value={RETURN_URL} />
                <input className="forum-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                <label>
                  <span>Full Name</span>
                  <input type="text" name="Full Name" autoComplete="name" maxLength={80} placeholder="What should I call you?" required />
                </label>

                <label>
                  <span>Discord User</span>
                  <input type="text" name="Discord User" autoComplete="off" maxLength={64} placeholder="username or @handle" required />
                </label>

                <label>
                  <span>Request Details</span>
                  <textarea name="Request Details" rows={5} maxLength={1500} placeholder="Tell me what you want to discuss, build, or request." required />
                </label>

                <button className="forum-submit" type="submit" disabled={sending}>
                  <span>{sending ? "Transmitting..." : "Send request"}</span>
                  <span className="forum-send-lottie" aria-hidden="true"><Lottie animationData={forumSendAnimation} loop autoplay /></span>
                </button>
              </form>
            )}

            <div className="forum-meta"><a href="/">&#8592; Back to Legacy</a><span>Replies go through Discord or email</span></div>
          </div>
        </div>

        <div className="forum-visual" aria-label="A sunset conversation at sea">
          <div className="forum-visual-shade" />
          <div className="forum-visual-index" aria-hidden="true">01</div>
          <div className="forum-visual-caption"><span>REQUEST INTAKE</span><strong>Some ideas begin with a quiet conversation.</strong></div>
        </div>
      </section>
      <UniversalFooter />
    </main>
  );
}
