import "./link.scss";

import { memo, ReactNode } from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps
} from "react-router-dom";
import classNames from "classnames";
import Hisotry from "history";
import { object } from "prop-types";

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to?: Hisotry.LocationDescriptor;
  replace?: boolean;
  color?: "action" | "text";
  hover?: "action" | "text";
  underline?: boolean;
  invisible?: boolean;
};

export const Link = memo<LinkProps>(props => {
  const {
    invisible,
    className,
    to,
    replace,
    color,
    underline,
    hover,
    children,
    ...anchorProps
  } = props;

  const LinkParent = ({ children }: { children: ReactNode }) => {
    if (typeof (children as any).props.children === "object") {
      return <span className={"link__wrapper"}>{children}</span>;
    } else {
      return <>{children}</>;
    }
  };

  const resolvedClassName = classNames("link", {
    ["link--invisible"]: invisible,
    ["link--color--" + color]: color,
    ["link--hover--" + hover]: hover,
    ["link--underline"]: underline,
    [className || ""]: className
  });

  if (to !== undefined) {
    return (
      <LinkParent>
        <RouterLink
          {...anchorProps}
          to={to}
          replace={replace}
          className={resolvedClassName}
        >
          {children}
        </RouterLink>
      </LinkParent>
    );
  } else {
    return (
      <LinkParent>
        <a {...anchorProps} className={resolvedClassName}>
          {children}
        </a>
      </LinkParent>
    );
  }
});
