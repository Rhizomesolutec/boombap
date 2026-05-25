import Header from "../../components/layout/Header";
import CustomCursor from "../../components/layout/CustomCursor";
import PageLoader from "../../components/layout/PageLoader";
import Footer from "../../components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-30 bg-secondary" />
      <div className="fixed inset-0 -z-10 pointer-events-none" />
      <PageLoader />
      <Header />
      <main className="grow">{children}</main>
      <CustomCursor />
      <Footer />
    </>
  );
}
