import "./input.scss";

import { memo, forwardRef } from "react";
import classNames from "classnames";

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {};

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, ...inputProps } = props;

  return (
    <input
      ref={ref}
      {...inputProps}
      className={classNames("input", {
        [className || ""]: className
      })}
    />
  );
});
