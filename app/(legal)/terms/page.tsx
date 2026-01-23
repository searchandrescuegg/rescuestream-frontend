import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | RescueStream",
  description: "Terms of Service for RescueStream - Rules and conditions for using the RescueStream application.",
};

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Terms of Service</h1>

      <p className="text-muted-foreground">
        <strong>Effective Date:</strong> January 23, 2026
      </p>

      <p>
        Please read these Terms of Service (&quot;Terms&quot;) carefully before using the RescueStream
        application (&quot;Service&quot;) operated by searchandrescue.gg (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
      </p>

      <p>
        By accessing or using the Service, you agree to be bound by these Terms. If you disagree
        with any part of the Terms, you may not access the Service.
      </p>

      <h2>1. Service Description</h2>

      <p>
        RescueStream is a live stream monitoring dashboard designed for search and rescue operations.
        The Service allows authorized users to:
      </p>

      <ul>
        <li>View and monitor live video streams</li>
        <li>Manage broadcasters and stream keys</li>
        <li>Access real-time streaming data and status information</li>
      </ul>

      <h2>2. User Accounts and Responsibilities</h2>

      <p>
        To access the Service, you must authenticate using a valid Google account. By creating
        an account, you agree to:
      </p>

      <ul>
        <li>Provide accurate and complete information</li>
        <li>Maintain the security of your account credentials</li>
        <li>Accept responsibility for all activities under your account</li>
        <li>Notify us immediately of any unauthorized access or security breach</li>
      </ul>

      <p>
        Access to the Service may be restricted to authorized users only. We reserve the right
        to deny or revoke access at our discretion.
      </p>

      <h2>3. Acceptable Use</h2>

      <p>When using the Service, you agree NOT to:</p>

      <ul>
        <li>Use the Service for any unlawful purpose or in violation of any laws</li>
        <li>Attempt to gain unauthorized access to any part of the Service</li>
        <li>Interfere with or disrupt the Service or servers connected to it</li>
        <li>Transmit malware, viruses, or other harmful code</li>
        <li>Share your account credentials with unauthorized individuals</li>
        <li>Use the Service to stream content that is illegal, harmful, or violates third-party rights</li>
        <li>Attempt to reverse engineer, decompile, or extract source code from the Service</li>
      </ul>

      <h2>4. Intellectual Property</h2>

      <p>
        The Service and its original content, features, and functionality are owned by
        searchandrescue.gg and are protected by international copyright, trademark, and
        other intellectual property laws.
      </p>

      <p>
        You retain ownership of any content you stream or upload through the Service. By using
        the Service, you grant us a limited license to process and display your content as
        necessary to provide the Service.
      </p>

      <h2>5. Limitation of Liability</h2>

      <p>
        To the maximum extent permitted by law, searchandrescue.gg shall not be liable for
        any indirect, incidental, special, consequential, or punitive damages, including but
        not limited to:
      </p>

      <ul>
        <li>Loss of data or content</li>
        <li>Service interruptions or downtime</li>
        <li>Unauthorized access to your account</li>
        <li>Any damages arising from your use or inability to use the Service</li>
      </ul>

      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
        either express or implied.
      </p>

      <h2>6. Disclaimer</h2>

      <p>
        While RescueStream is designed to support search and rescue operations, the Service
        should not be relied upon as the sole means of communication or coordination in
        emergency situations. Users should always have backup communication methods available.
      </p>

      <h2>7. Changes to Terms</h2>

      <p>
        We reserve the right to modify or replace these Terms at any time at our sole discretion.
        If a revision is material, we will provide at least 30 days notice prior to any new
        terms taking effect.
      </p>

      <p>
        Your continued use of the Service after any changes to the Terms constitutes acceptance
        of those changes.
      </p>

      <h2>8. Termination</h2>

      <p>
        We may terminate or suspend your access to the Service immediately, without prior notice
        or liability, for any reason, including but not limited to breach of these Terms.
      </p>

      <p>
        Upon termination, your right to use the Service will cease immediately. Provisions of
        these Terms that by their nature should survive termination shall survive.
      </p>

      <h2>9. Governing Law</h2>

      <p>
        These Terms shall be governed by and construed in accordance with applicable laws,
        without regard to conflict of law principles.
      </p>

      <p>
        Any disputes arising from these Terms or your use of the Service shall be resolved
        through good faith negotiation. If negotiation fails, disputes shall be submitted to
        binding arbitration.
      </p>

      <h2>10. Contact Information</h2>

      <p>
        If you have any questions about these Terms, please contact us at:
      </p>

      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:contact@searchandrescue.gg">contact@searchandrescue.gg</a>
      </p>
    </article>
  );
}
