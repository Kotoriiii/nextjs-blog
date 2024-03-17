import type { NextPage } from 'next';
import Navbar from 'component/navbar';
import Footer from 'component/footer';
import { ReactNode } from 'react';

type props = {
  children: ReactNode,
};

const Layout: NextPage<props> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
