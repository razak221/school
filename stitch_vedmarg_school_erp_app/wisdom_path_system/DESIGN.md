---
name: Wisdom Path System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#000a1e'
  on-primary: '#ffffff'
  primary-container: '#002147'
  on-primary-container: '#708ab5'
  inverse-primary: '#aec7f6'
  secondary: '#0c6780'
  on-secondary: '#ffffff'
  secondary-container: '#9ae1ff'
  on-secondary-container: '#09657f'
  tertiary: '#160700'
  on-tertiary: '#ffffff'
  tertiary-container: '#371a00'
  on-tertiary-container: '#cf7000'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f6'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#baeaff'
  secondary-fixed-dim: '#89d0ed'
  on-secondary-fixed: '#001f29'
  on-secondary-fixed-variant: '#004d62'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  success-green: '#22C55E'
  error-red: '#EF4444'
  text-main: '#1E293B'
  text-muted: '#64748B'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  stats-display:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max-width: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  bento-gap: 16px
---

## Brand & Style

This design system is built on the concept of **"The Way of Wisdom"**—a narrative that balances traditional institutional authority with the clarity of modern intelligence. It is designed for educational administrators, teachers, and parents who require a professional and trustworthy environment to manage complex ERP data without cognitive fatigue.

The visual style is **Corporate / Modern** with a **Bento Grid** influence. It utilizes modular "Lego-style" containers to organize disparate data points into a cohesive, glanceable frame. The aesthetic is clean and high-fidelity, featuring generous whitespace, refined iconography, and subtle micro-interactions that provide immediate "human-first" feedback. The goal is to transform a standard data-entry experience into a "Decision Intelligence" tool.

## Colors

The color palette is architected to convey stability and focus. 
- **Primary Navy Blue (#002147)**: Represents institutional authority and "Wisdom." It is used for headers, primary branding, and deep navigation elements.
- **Secondary Sky Blue (#87CEEB)**: Provides a modern, tech-forward energy. Used for secondary accents, progress indicators, and active states.
- **Tactical Orange (#FF8C00)**: Reserved strictly for alerts, urgent CTAs, and functional highlights to ensure critical information breaks through the calm blue palette.
- **White & Neutral (#FFFFFF, #F8FAFC)**: Used as the base surface to maximize legibility and provide the "generous whitespace" required to prevent dashboard fatigue.

## Typography

Typography focuses on high-contrast legibility for data-dense environments. **Montserrat** is the sole typeface, chosen for its geometric clarity and professional presence.

- **Headlines**: Use heavy weights (600-700) and tighter letter spacing for institutional branding and section titles.
- **Data Display**: Large numerical values in stat cards use the `stats-display` role to ensure quick scanning of KPIs like attendance percentages or fee amounts.
- **Body & Labels**: Standard body text uses a medium weight for maximum readability in reports, while labels use uppercase styling with increased letter spacing to differentiate metadata from content.

## Layout & Spacing

This design system utilizes a **Fixed Grid** for internal content areas and a **Bento Grid** model for dashboard modules.

- **Bento Philosophy**: Elements are grouped into rectangular tiles with a consistent `bento-gap`. This allows for a non-linear layout where disparate modules (e.g., "Fee Status" next to "Upcoming Exams") feel unified.
- **Desktop**: A 12-column grid with 24px gutters. Dashboard modules should span 3, 4, 6, or 12 columns.
- **Mobile**: A single-column flow with 16px side margins. Bento cards reflow vertically, maintaining the same gap rhythm.
- **Whitespace**: Generous internal padding (24px - 32px) within cards is mandatory to ensure data "breathes" and reduces user stress.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Subtle Ambient Shadows**. 

1. **Base**: The background uses a neutral off-white (#F8FAFC) to define the canvas.
2. **Surface (Cards)**: Dashboard cards and student profiles are pure white (#FFFFFF). 
3. **Depth**: Surfaces use a very soft, diffused shadow (Blur: 15px, Opacity: 4%, Color: Primary Navy) to create a subtle lift without appearing heavy. 
4. **Interactive Overlays**: Modals and dropdowns use a slightly higher elevation with a 10% opacity backdrop blur to focus the user's attention.
5. **Outlines**: For data-heavy tables or input fields, a low-contrast 1px border (#E2E8F0) is preferred over shadows to maintain structural integrity.

## Shapes

The shape language is **Rounded (Level 2)**. This soften the "institutional" feel of the ERP, making it more approachable for parents and teachers.

- **Dashboard Cards**: Use `rounded-lg` (1rem) to create the signature "Bento" look.
- **Buttons & Inputs**: Use standard `rounded` (0.5rem) for a balanced, modern feel.
- **Notification Badges & Chips**: Use pill-shaped rounding for high-contrast visibility.
- **Avatars**: Student and teacher profiles should be circular or use `rounded-xl` to stand out from rectangular data containers.

## Components

### Stats Cards
The cornerstone of the Bento dashboard. Must include a `label-bold` title, a `stats-display` value, and a small Sky Blue or Orange trend indicator (e.g., "+2% from last month").

### Student/Teacher Profiles
Cards featuring high-quality avatars on the left, with primary details (Name, Class/Department) in `headline-md` and metadata in `body-sm`. Profiles should include quick-action icons (Call, Message, Email).

### Fee Status Indicators
A specialized chip component. "Paid" uses a Success Green background with 10% opacity and dark green text. "Due" uses Primary Navy. "Overdue" uses tactical Orange to signal urgency.

### Notification Badges
Small, high-contrast Orange circles placed on the top-right of icons. Use `label-bold` for count numbers.

### Input Fields
Clean, outlined boxes with `rounded` corners. Focus states should use a 2px Sky Blue border.

### Buttons
- **Primary**: Solid Navy Blue with white text.
- **Secondary**: Outlined Navy Blue or solid Sky Blue for less critical actions.
- **Alert/CTA**: Solid Orange for high-conversion moments (e.g., "Pay Now", "Sign Up").