import About from "./_components/about";
import Commitment from "./_components/commitment";
import Hero from "./_components/hero";

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-10">
      <Hero />
      <About />
      <Commitment />
    </main>
  );
}
