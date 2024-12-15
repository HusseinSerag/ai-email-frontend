import { useEffect } from "react";
import { useMail } from "./useMail";
import { useLocation } from "react-router-dom";

export function useSetTitle() {
  const { chosenAccount } = useMail();
  const { pathname } = useLocation();
  useEffect(
    function () {
      if (pathname === "/mail" && chosenAccount)
        document.title = chosenAccount.emailAddress;
      else document.title = "AI Email";
    },
    [chosenAccount]
  );
}
