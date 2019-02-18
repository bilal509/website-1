import "./textArea.scss";

import { forwardRef } from "react";
import classNames from "classnames";

export type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    const { className, ...textAreaProps } = props;

    return (
      <textarea
        ref={ref}
        {...textAreaProps}
        className={classNames("textArea", {
          [className || ""]: className
        })}
      />
    );
  }
);
