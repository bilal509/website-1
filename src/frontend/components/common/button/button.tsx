import "./button.scss";

import { memo, ReactNode } from "react";
import classNames from "classnames";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  primary?: boolean;
  secondary?: boolean;
  facebook?: boolean;
  shallow?: boolean;
  deactivated?: boolean;
};

export const Button = memo<ButtonProps>(props => {
  const {
    deactivated,
    primary,
    secondary,
    facebook,
    shallow,
    className,
    ...buttonProps
  } = props;

  return (
    <button
      {...buttonProps}
      className={classNames("button", {
        "button--primary": primary,
        "button--secondary": secondary,
        "button--deactivated": deactivated,
        "button--primary--shallow": primary && shallow,
        "button--secondary--shallow": secondary && shallow,
        "button--facebook": facebook,
        [className || ""]: className
      })}
    />
  );
});
