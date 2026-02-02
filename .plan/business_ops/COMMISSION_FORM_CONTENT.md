# Commission Intake Form Content & UX Design

**Goal**: To allow clients to download their brain into your workflow with minimal friction, ensuring you have 100% of what you need to start the sketch immediately.

## 1. UX Flow Overview
The form is divided into **4 Logical Sections** to prevent cognitive overload.
1.  **Identity & Contact** (Who are you?)
2.  **The Commission Specs** (What are you buying?)
3.  **The Creative Brief** (What does it look like?)
4.  **Agreement & Handshake** (Legal & Submission)

## 2. Form Fields & Content

### Section 1: Identity & Contact
*Goal: Establish communication channels.*

*   **Name / Nickname** (Required)
*   **Email Address** (Required)
    *   *Help Text*: "This is where I will send the Xendit Invoice and final files."
*   **Preferred Socials / Messaging** (Select One)
    *   [ ] Facebook Messenger (Username#1234)
    *   [ ] Viber (Phone Number)
    *   [ ] Twitter/X (@Handle)
    *   [ ] Email Only

### Section 2: Technical Specs (The Order)
*Goal: Define the scope based on your Pricing Strategy.*

*   **Commission Type** (Dropdown)
    *   Sketch / Rough (Entry Level)
    *   Flat Color / Cel Shaded (Standard)
    *   Full Render (Premium)
*   **Scale / Cut** (Radio Button)
    *   Headshot / Bust
    *   Half-Body (Thigh-up)
    *   Full Body
*   **Add-Ons** (Checkboxes)
    *   [ ] Complex Background (+₱1,500 / +$30)
    *   [ ] Extra Character (+75% Base Price)
    *   [ ] Commercial Use Rights (See TOS)
    *   [ ] Rush Order (See Guidelines for fees)
*   **Intended Use / Output Size** (Text Field)
    *   *Help Text*: "Is this for a Twitch banner, a phone wallpaper, or a printable poster? (e.g., A4 size 300DPI)"

### Section 3: The Creative Brief (The "Vibe" Check)
*Goal: Extract the artistic vision.*

*   **Character Name(s)**
*   **Reference Images** (File Upload or URL)
    *   *Help Text*: "Please provide a Google Drive link or upload images. Visuals are better than descriptions! If you don't have a ref sheet, a collage of photos (Moodboard) works."
*   **Physical Description** (Text Area - Short)
    *   *Prompt*: "Species, Age, Gender, Body Type. Important traits like scars, tattoos, or specific accessories."
*   **Personality & Mood** (Text Area)
    *   *Prompt*: "Describe them in 3 words (e.g., 'Shy, Clumsy, Sweet' or 'Arrogant, Deadly, Royal'). What emotion should the viewer feel looking at this?"
*   **Pose & Composition** (Text Area)
    *   *Prompt*: "Dynamic action pose? Sitting quietly? If you have a stick figure drawing, upload it above! If unsure, type 'Artist's Choice'."
*   **Setting & Background** (Text Area)
    *   *Prompt*: "Simple color/gradient (Free) or specific scenery (Paid Add-on)? e.g., 'Neon city street at night' or 'Soft pastel pink void'."
*   **Lighting Code** (Radio Button)
    *   Warm (Golden Hour, Cozy, Fire)
    *   Cool (Cyberpunk, Night, Underwater)
    *   Neutral / Daylight
    *   Dramatic (High Contrast)
    *   Artist's Choice

### Section 4: Agreement Checklist (Must-Check)
*Goal: Enforce the Terms of Service proactively.*

*   [ ] **I strictly agree that I am 18+ years old (if applicable) and legally able to commit to this purchase.**
*   [ ] **I understand I am buying a DIGITAL FILE only. No physical item will be shipped.**
*   [ ] **I have read and agree to the Terms of Service (No NFTs, No Chargebacks).**
*   [ ] **I understand that refunds are not possible once the 'Sketch Phase' is approved.**

---

## 3. Form Logic Strategy (Conditional Logic)
Use this logic to keep the form clean and show questions only when relevant.

| Trigger Answer | Action | Rationale |
| :--- | :--- | :--- |
| **Add-Ons** contains "Commercial Use" | **Show**: "Commercial Project Details" Field.<br>*"Please describe the project (Game, Book Cover, Merch) and expected distribution."* | Price quotes for commercial work vary wildly based on distribution scope. |
| **Add-Ons** contains "Rush Order" | **Show**: "Deadline Date" Date Picker. | You need to know exactly when they need it to calculate the Rush Fee %. |
| **Commission Type** == "Sketch / Rough" | **Hide**: "Lighting Code" option (Set to "Neutral"). | Sketches usually don't involve complex lighting rendering. |
| **Reference Images** is Empty | **Show Warning**: "Text-only descriptions may incur a design fee. Are you sure?" | Encourages users to find refs, saving you design time. |
