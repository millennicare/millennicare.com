import { getSession } from "../actions";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  return (
    <div>
      <Navbar isLoggedIn={session.isLoggedIn} />
      {children}
      <Footer />
    </div>
  );
};

export default PublicLayout;
