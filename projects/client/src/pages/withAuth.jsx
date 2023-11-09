import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getLocalStorage } from "../utils/tokenGetterSetter";
import { useEffect } from "react";

function withAuth(Component) {
  return (props) => {
    const access_token = getLocalStorage("access_token");
    const userDoc = useSelector((state) => state.userDocument.value);
    const navigate = useNavigate();

    if (access_token && userDoc) {
      return <Component {...props} />;
    }
    useEffect(() => {
      navigate("/");
    }, [navigate]);
  };
}

export default withAuth;
