import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/landing/Hero';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { Steps } from '../components/landing/Steps';
import { Awards } from '../components/landing/Awards';
import { Safety } from '../components/landing/Safety';
import { FAQ } from '../components/landing/FAQ';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/layout/Footer';

export function LandingPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Hero />
                <FeatureGrid />
                <Steps />
                <Awards />
                <Safety />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
