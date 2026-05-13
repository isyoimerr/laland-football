import HeroSection from '@components/landing/HeroSection'
import LiveTicker from '@components/landing/LiveTicker'
import PlayersSection from '@components/landing/PlayersSection'
import FeaturesSection from '@components/landing/FeaturesSection'
import StatsSection from '@components/landing/StatsSection'
import MatchesPreview from '@components/landing/MatchesPreview'
import VideoCarousel from '@components/landing/VideoCarousel'
import CTASection from '@components/landing/CTASection'

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <LiveTicker />
      <PlayersSection />
      <FeaturesSection />
      <StatsSection />
      <MatchesPreview />
      <VideoCarousel />
      <CTASection />
    </div>
  )
}
