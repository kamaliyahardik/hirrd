import Link from "next/link"

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Introduction</h2>
            <p className="text-muted-foreground">
              These Terms of Service ("Terms") govern your use of JobHub and all associated services, features, and
              products. By accessing or using JobHub, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">User Accounts</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. You agree to provide accurate and complete information during registration
              and to update such information as necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Acceptable Use</h2>
            <p className="text-muted-foreground">
              You agree not to use JobHub for any unlawful purpose or in violation of any applicable laws. You shall not
              post content that is abusive, threatening, obscene, or otherwise objectionable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Intellectual Property</h2>
            <p className="text-muted-foreground">
              The content, features, and functionality of JobHub are owned by JobHub, its licensors, or other providers
              of such material and are protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law, JobHub shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at legal@jobhub.com.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
