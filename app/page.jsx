import SmoothScroll from '@/components/SmoothScroll';
import { LangProvider } from '@/lib/i18n';
import CartProvider from '@/components/CartContext';
import CartDrawer from '@/components/CartDrawer';
import Preloader from '@/components/Preloader';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Manifesto from '@/components/Manifesto';
import Drop from '@/components/Drop';
import Craft from '@/components/Craft';
import Story from '@/components/Story';
import Community from '@/components/Community';
import Teaser from '@/components/Teaser';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <LangProvider>
      <SmoothScroll>
        <CartProvider>
          <Preloader />
          <Nav />
          <main>
            <Hero />
            <Marquee />
            <Manifesto />
            <Drop />
            <Craft />
            <Story />
            <Community />
            <Teaser />
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </SmoothScroll>
    </LangProvider>
  );
}
