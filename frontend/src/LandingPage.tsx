type LandingPageProps = {
  onStart: () => void
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <main className="landing">
      <section className="landing__content">
        <p className="landing__eyebrow">Enterprise AI FinOps Platform</p>
        <h1>
          Welcome, your optimization copilot,{' '}
          <span>and get started below.</span>
        </h1>
        <button className="primary-button" type="button" onClick={onStart}>
          Get started
        </button>
      </section>
    </main>
  )
}
