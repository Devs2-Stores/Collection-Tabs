import { useSearchParams } from "react-router-dom";
import { authService } from "../../services/HrvService";
import { useEffect } from "react";

const Install = () => {
  let [searchParams] = useSearchParams();
  useEffect(() => {
    const code = searchParams.get("code"); 
    if (code && code != null) authService.getToken(code);
    else authService.install().then((response) => {
      console.log(response);
    })
  }, [searchParams]);
  return (
    <>
      <div className="text-white">Installzzz</div>
    </>
  );
};

export default Install;
