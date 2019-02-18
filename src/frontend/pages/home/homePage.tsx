import "./homePage.scss";
import { browserHistory } from "enviroment/history";

type Props = {};

export const HomePage = ({  }: Props) => {
  browserHistory.push("/auth/login");

  return null;
};
