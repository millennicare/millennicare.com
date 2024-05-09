import { validateRequest } from "../lib/auth";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const { session } = await validateRequest();

  return (
    <div>
      <Navbar isLoggedIn={session?.fresh ?? false} />
      {children}
      <Footer />
    </div>
  );
};

export default PublicLayout;
