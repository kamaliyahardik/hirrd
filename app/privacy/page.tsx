import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border sticky top-0 bg-card/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            JobHub
          </Link>
          <Link href="/" className="text-sm text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Introduction</h2>
            <p className="text-muted-foreground">
              JobHub ("we", "us", "our") operates the JobHub website and mobile application. This page informs you of
              our policies regarding the collection, use, and disclosure of personal data when you use our Service and
              the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Information Collection</h2>
            <p className="text-muted-foreground">
              We collect several different types of information for various purposes to provide and improve our Service
              to you.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Email address and password for account creation</li>
              <li>Name, location, and professional information</li>
              <li>Resume and cover letter documents</li>
              <li>Job preferences and application history</li>
              <li>Usage data and analytics information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Use of Data</h2>
            <p className="text-muted-foreground">
              JobHub uses the collected data for various purposes including providing and maintaining our Service,
              notifying you about changes to our Service, and detecting and preventing fraudulent transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Security</h2>
            <p className="text-muted-foreground">
              The security of your data is important to us but remember that no method of transmission over the Internet
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
              protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at privacy@jobhub.com.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
