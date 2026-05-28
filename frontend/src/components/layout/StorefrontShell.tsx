import type { PropsWithChildren, ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductMobileHeader } from "@/components/layout/ProductMobileHeader";

type StorefrontShellProps = PropsWithChildren<{
  hero?: ReactNode;
  navbarVariant?: "default" | "product";
}>;

export function StorefrontShell({
  children,
  hero,
  navbarVariant = "default",
}: StorefrontShellProps) {
  return (
    <div className="storefront-shell page-fade">
      {navbarVariant === "product" ? (
        <>
          <div className="desktop-only">
            <Navbar variant="product" />
          </div>
          <ProductMobileHeader />
        </>
      ) : (
        <Navbar variant="default" />
      )}
      {hero}
      <main>{children}</main>
      <Footer />
    </div>
  );
}
