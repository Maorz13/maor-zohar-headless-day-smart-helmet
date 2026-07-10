import type { Metadata } from "next"

import { BUSINESS } from "@/lib/wix"

export const metadata: Metadata = {
  title: "Privacy Policy",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <div className="mt-6 space-y-4 leading-7 text-muted-foreground">
        <p>
          {BUSINESS.name} collects only what it needs to fit your helmet and
          fulfil your order: your contact details, booking preferences, and —
          if you buy a helmet — the calibration measurements from your fitting.
        </p>
        <p>
          Calibration maps are stored in your rider profile so replacement
          visors arrive pre-calibrated. They are never shared or sold, and you
          can ask us to delete them at any time by emailing{" "}
          <a href={`mailto:${BUSINESS.email}`} className="underline underline-offset-4">
            {BUSINESS.email}
          </a>
          .
        </p>
        <p>
          Payments are processed by Wix eCommerce; we never see or store your
          card details. Ride data from the helmet stays on your device unless
          you opt in to sharing hazard reports with other riders.
        </p>
        <p>
          Questions? Write to {BUSINESS.email} or visit us at {BUSINESS.street},{" "}
          {BUSINESS.city}, {BUSINESS.country}.
        </p>
      </div>
    </div>
  )
}
