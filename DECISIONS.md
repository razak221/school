# Architectural & Project Decisions — Govt Middle School Awanpora ERP

## School Profile & Context
- **Name**: Govt Middle School Awanpora
- **Location**: Awanpora, Salia, Zone Mattan (Mattal), District Anantnag, Jammu & Kashmir
- **Scheme**: SSA (Samagra Shiksha Abhiyan / Sarva Shiksha Abhiyan), J&K SED
- **Classes**: Class 1st through 8th (Primary: 1-5, Upper Primary: 6-8)
- **Special Modules**:
  1. Mid-Day Meal (MDM) Daily Distribution Tracker
  2. SSA Grant & School Maintenance Fund Management
  3. Winter/Summer Vacation Notice Broadcasts with Urdu/Kashmiri AI Translation
  4. Multilingual Parent Communication (English, Urdu, Kashmiri, Hindi)

## Multi-Tenancy Design
- Every Mongoose model contains `organizationId: mongoose.Schema.Types.ObjectId` referencing `Organization`.
- The JWT payload stores `{ userId, organizationId, role }`.
- Route middleware automatically attaches `req.user.organizationId` and guarantees isolation across tenants.

## UI/UX Design System
- Built on the unzipped **Wisdom Path System**:
  - Primary Navy: `#002147`
  - Secondary Sky Blue: `#0c6780` / `#9ae1ff`
  - Alert / Action Orange: `#FF8C00`
  - Font: Montserrat
  - Layout: 12-column Bento Grid on desktop, seamless responsive stack on mobile.
