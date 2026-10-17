# Walter AI — Privacy & Security Specification

Security, privacy, and regulatory compliance are foundational to Walter AI.

---

## 1. Compliance Principles

1. **AI Disclosure:** Walter must always identify itself as an artificial intelligence voice assistant at the onset of any telephone interaction.
2. **Opt-in Recording:** Raw call audio recording is **disabled by default**. Recording is only enabled when explicitly toggled by the owner, and callers are notified immediately with a two-party consent disclosure.
3. **Structured Synthesis over Transcript Retention:** By default, Walter discards full verbatim speech transcripts after synthesizing concise executive summaries and key action items.
4. **Owner Guardrails:** Callers are treated as untrusted input. Walter strictly adheres to negative constraints: it will never disclose financial credentials, home addresses, or private itineraries regardless of caller prompting.

---

## 2. Data Retention & Purging

- The owner can configure retention windows (7, 30, 90, or 365 days) from `/dashboard/settings`.
- A permanent **Purge All Telemetry** capability allows instant, irreversible deletion of all stored metadata, summaries, and contacts.
