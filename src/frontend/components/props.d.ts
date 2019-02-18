import { MouseEvent } from "react";

declare global {
  type CommonReactProps<THTMLElement> = {
    className?: string;
    onClick?: (event: MouseEvent<THTMLElement>) => void;
  };
}

export const needed = "";
