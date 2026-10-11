# Speed Money — Frontend UI Flow

Speed Money loan management interactive UI prototype for customers, administrators, and collection agents.

## Portals Included
- **Customer App**: Mobile experience with onboarding, loan application, EMI tracking, payments, and receipts.
- **Admin Portal**: Comprehensive desktop portal for loan officers and administrators to manage customers, applications, loans, EMIs, collections, and reports.
- **Collection Agent App**: Mobile flow for on-field collection agents with cash collection, customer OTP verification, signatures, and cash ledger.

## Architecture
- Prototype screens are registered in maps in `src/screens/{customer,admin,agent}.tsx` and served by dynamic routes per portal (`/app/$screen`, `/admin/$screen`, `/agent/$screen`).
- Built with React 19, TanStack Start & Router, and Tailwind CSS.

## Getting Started

```sh
npm install
npm run dev
```

The application will be accessible at `http://localhost:8080/`.

## Build & Preview

```sh
npm run build
npm run preview
```
