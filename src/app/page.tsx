import HeroSection from '@/components/home/HeroSection';
import Layout from '@/components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="h-full">
        <HeroSection />
      </div>
    </Layout>
  );
}
