import { useSelector } from "react-redux";
import { getLocalStorage } from "../utils/tokenGetterSetter";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function withSignedIn(Component) {
  return (props) => {
    const access_token = getLocalStorage("access_token");
    const userDoc = useSelector((state) => state.userDocument.value);
    const navigate = useNavigate();

    if (access_token && userDoc) {
      useEffect(() => {
        navigate(-1);
      }, [navigate]);
    }
    return <Component {...props} />;
  };
}

export default withSignedIn;
