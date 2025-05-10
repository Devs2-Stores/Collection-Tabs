import { useSearchParams } from "react-router-dom";
import { authService } from "../../services/HrvService";
import { useEffect } from "react";
import Spinner from "../../components/Spinner/index";

const Login = () => {
  let [searchParams] = useSearchParams();
  useEffect(() => {
    const code = searchParams.get("code");
    if (code && code != null) authService.getToken(code);
    else
      authService.login().then((response) => {
        if (response.success) {
          window.location.href = response.data;
        }
      });
  }, [searchParams]);
  return <Spinner />;
};

export default Login;
