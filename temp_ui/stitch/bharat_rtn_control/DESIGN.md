# Design System Strategy: India Post RTN Telematics

## 1. Overview & Creative North Star: "The Tactical Observer"
The mission of this design system is to transform raw telematics data into an authoritative, mission-control experience. The Creative North Star is **"The Tactical Observer"**—a visual language that feels like a high-end aviation cockpit or a global logistics nerve center. 

Unlike generic dashboards that rely on flat boxes and heavy borders, this system utilizes **Layered Atmospheric Depth**. We break the "template" look by using high-density information clusters balanced by expansive, dark-navy negative space. We prioritize a "heads-up display" (HUD) aesthetic where data feels projected rather than printed, using intentional asymmetry in the layout to guide the eye toward critical transport anomalies.

---

## 2. Colors & Atmospheric Tones
The palette is rooted in a deep navy-black foundation, allowing the iconic India Post Red to function as a surgical strike of color for primary actions.

### Surface Hierarchy & Nesting
To move beyond "standard" UI, we prohibit the use of 1px solid structural lines for sectioning. 
- **The "No-Line" Rule:** Do not use borders to separate main content areas. Use the transition from `surface` (#0e1322) to `surface_container_low` (#161b2b) to define regions.
- **Nesting Logic:** Place `surface_container_highest` (#2f3445) elements inside `surface_container` (#1a1f2f) to create natural prominence. This "tonal stacking" mimics the physical depth of stacked glass panes.
- **The Glass & Gradient Rule:** For floating mission-critical modals, use `surface_variant` (#2f3445) at 60% opacity with a `backdrop-blur` of 20px. 
- **Signature Glow:** Apply a subtle `primary` (#ffb4a9) outer glow (blur: 15px, opacity: 0.1) on hover for interactive telematics cards to simulate high-tech luminescence.

---

## 3. Typography: Technical Authority
We employ a dual-type system to balance human readability with industrial precision.

*   **Display & Headlines (Space Grotesk):** Used for high-level metrics (e.g., Total Fleet Active). This font's geometric quirks provide the "Modern/Industrial" feel.
*   **Technical & Data (IBM Plex Mono):** All telematics, timestamps, and coordinates must use this mono-spaced face. It ensures that shifting numbers don't cause layout "jitter" and conveys a sense of raw, unedited data.
*   **Labels & Body (Inter):** The workhorse for UI labels. Use `label-sm` (0.6875rem) for secondary metadata to maintain high-density information without clutter.

---

## 4. Elevation & Depth: Tonal Layering
In this design system, elevation is a product of light and transparency, not shadows.

*   **The Layering Principle:** Instead of standard shadows, use the `surface_container` tiers. A vehicle detail pane should be `surface_container_high`, sitting atop a `surface_dim` map view.
*   **Ambient Shadows:** If an element must "float" (like a context menu), use a shadow tinted with `secondary` (#adc6ff) at 5% opacity. This feels like ambient light reflecting off a screen rather than a "drop shadow" on a page.
*   **The Ghost Border:** For accessibility in high-density data tables, use a 1px border using `outline_variant` (#5c403c) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use `surface_tint` (#ffb4a9) at 2% opacity as an overlay on glass cards to give them a subtle "material" feel, preventing them from looking like simple grey boxes.

---

## 5. Components & Primitives

### Buttons
*   **Primary (Action):** India Post Red (`primary_container`). Use a subtle gradient from `primary` to `primary_container` to add "soul."
*   **Secondary (Data):** `secondary_container` (#0566d9) with white text. High contrast for navigation actions.
*   **Tertiary:** No background. Use `on_surface_variant` text with a 1px `ghost border` on hover.

### Inputs & Telematics Fields
*   **Stateful Inputs:** Use `surface_container_lowest` for the input field background. The focus state must use a `primary` glow rather than a heavy border.
*   **Technical Chips:** For vehicle status (e.g., "In Transit"), use a `tertiary_container` background with `on_tertiary_fixed` text. Keep corners at `sm` (0.125rem) for a sharp, industrial look.

### Cards & Lists
*   **The "No Divider" Rule:** Never use horizontal lines to separate list items. Use 1.3rem (`spacing-6`) of vertical white space or a subtle background toggle between `surface_container_low` and `surface_container`.
*   **Telematics Cards:** Must feature a `surface_variant` header with `IBM Plex Mono` data points.

---

## 6. Do’s and Don’ts

### Do
*   **Do** embrace high-density layouts. Logistics operators need to see more, not less.
*   **Do** use `Space Grotesk` for numbers that represent "Scale" and `IBM Plex Mono` for numbers that represent "Precision."
*   **Do** use `tertiary` (#4edea3) for "On-time" statuses to provide a calming contrast to the intense red primary accents.

### Don't
*   **Don't** use rounded corners larger than `xl` (0.75rem). The system should feel "engineered" and sharp, not "bubbly" or consumer-grade.
*   **Don't** use pure black (#000000). Always use the navy-black `surface` (#0e1322) to maintain depth and color harmony.
*   **Don't** use 100% opaque borders. They flatten the UI and break the "Tactical Observer" immersion.