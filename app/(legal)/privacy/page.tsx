import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RescueStream",
  description: "Privacy Policy for RescueStream - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Privacy Policy</h1>

      <p className="text-muted-foreground">
        <strong>Effective Date:</strong> January 23, 2026
      </p>

      <p>
        This Privacy Policy describes how searchandrescue.gg (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
        collects, uses, and protects your personal information when you use the RescueStream
        application (&quot;Service&quot;).
      </p>

      <h2>1. Information We Collect</h2>

      <p>
        When you sign in to RescueStream using Google OAuth, we collect the following information
        from your Google account:
      </p>

      <ul>
        <li><strong>Email address</strong> - Used to identify your account and for communication purposes</li>
        <li><strong>Name</strong> - Used to personalize your experience within the application</li>
        <li><strong>Profile picture</strong> - Displayed in the application interface</li>
      </ul>

      <p>
        We do not collect any additional personal information beyond what is provided through
        Google OAuth authentication.
      </p>

      <h2>2. How We Use Your Information</h2>

      <p>We use the information we collect to:</p>

      <ul>
        <li>Authenticate and identify you when you access the Service</li>
        <li>Provide and maintain the Service</li>
        <li>Personalize your experience within the application</li>
        <li>Communicate with you about Service-related matters</li>
        <li>Ensure the security and integrity of the Service</li>
      </ul>

      <h2>3. Data Storage and Security</h2>

      <p>
        Your personal information is stored securely using industry-standard security measures.
        We implement appropriate technical and organizational measures to protect your data
        against unauthorized access, alteration, disclosure, or destruction.
      </p>

      <p>
        Session data is encrypted and stored securely. We regularly review and update our
        security practices to ensure the protection of your information.
      </p>

      <h2>4. Data Sharing</h2>

      <p>
        We do not sell, trade, or otherwise transfer your personal information to third parties.
        Your information may only be disclosed in the following circumstances:
      </p>

      <ul>
        <li>With your explicit consent</li>
        <li>To comply with legal obligations or valid legal processes</li>
        <li>To protect our rights, privacy, safety, or property</li>
        <li>In connection with a merger, acquisition, or sale of assets (with notice to you)</li>
      </ul>

      <h2>5. Your Rights</h2>

      <p>You have the following rights regarding your personal information:</p>

      <ul>
        <li><strong>Access</strong> - You can request a copy of your personal data</li>
        <li><strong>Correction</strong> - You can request correction of inaccurate data</li>
        <li><strong>Deletion</strong> - You can request deletion of your personal data</li>
        <li><strong>Portability</strong> - You can request your data in a portable format</li>
        <li><strong>Withdrawal of Consent</strong> - You can withdraw consent at any time by signing out and discontinuing use of the Service</li>
      </ul>

      <p>
        To exercise any of these rights, please contact us using the information provided below.
      </p>

      <h2>6. Cookies and Tracking</h2>

      <p>
        RescueStream uses essential cookies for authentication and session management.
        These cookies are necessary for the Service to function properly and cannot be disabled.
      </p>

      <h2>7. Changes to This Policy</h2>

      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes
        by posting the new Privacy Policy on this page and updating the &quot;Effective Date&quot; above.
        We encourage you to review this Privacy Policy periodically.
      </p>

      <h2>8. Contact Information</h2>

      <p>
        If you have any questions about this Privacy Policy or our data practices, please
        contact us at:
      </p>

      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:contact@searchandrescue.gg">contact@searchandrescue.gg</a>
      </p>
    </article>
  );
}
