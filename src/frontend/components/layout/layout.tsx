import "./layout.scss";

import { Navbar } from "./components/navbar/navbar";
import { ReactNode } from "react";
import { Subscribe } from "unstated";
import { ViewerStore } from "store/viewer";

type LayoutProps = { children: ReactNode };

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Subscribe to={[ViewerStore]}>
        {(viewer: ViewerStore) => {
          return <Navbar viewer={viewer} />;
        }}
      </Subscribe>
      <div className={"layout"}>{children}</div>
    </>
  );
};
