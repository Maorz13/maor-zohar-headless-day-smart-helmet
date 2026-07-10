import type { Metadata } from "next"

import { BUSINESS } from "@/lib/wix"

export const metadata: Metadata = {
  title: "Terms & Conditions",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Terms &amp; Conditions
      </h1>
      <div className="mt-6 space-y-4 leading-7 text-muted-foreground">
        <p>
          Demo rides are free and carry no obligation. No payment is taken
          until you confirm the fitted helmet after your ride.
        </p>
        <p>
          Helmets can be returned within 30 days in unridden condition for a
          full refund; fitted calibration is redone free with any exchange.
          Statutory warranty rights under Danish and EU law apply in full.
        </p>
        <p>
          The HaloRide display and speakers are riding aids, not a substitute
          for attention. Riders remain responsible for observing traffic law —
          the hazard layer supplements your eyes; it does not replace them.
        </p>
        <p>
          Orders are processed through Wix eCommerce. For anything else, write
          to {BUSINESS.email} or visit {BUSINESS.street}, {BUSINESS.city},{" "}
          {BUSINESS.country}.
        </p>
      </div>
    </div>
  )
}
