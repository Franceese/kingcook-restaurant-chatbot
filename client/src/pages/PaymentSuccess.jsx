import { useEffect } from "react";

import { useSearchParams } from "react-router-dom";

import axios from "axios";

function PaymentSuccess() {

  const [params] = useSearchParams();

  useEffect(() => {

    const verifyPayment = async () => {

      try {

        const reference =
        params.get("reference");

        const sessionId =
        localStorage.getItem("sessionId");

        await axios.post(
          "http://localhost:5000/api/chat/verify-payment",
          {
            reference,
            sessionId
          }
        );

        setTimeout(() => {

          window.location.href = "/";

        }, 2000);

      } catch (error) {

        alert("Verification failed");
      }
    };

    verifyPayment();

  }, []);

  return (

    <div
      className="
      min-h-screen
      bg-slate-900
      flex
      items-center
      justify-center
      text-white
      "
    >

      <div
        className="
        bg-black/40
        p-10
        rounded-3xl
        backdrop-blur-md
        text-center
        "
      >

        <h1
          className="
          text-4xl
          font-bold
          text-green-400
          mb-4
          "
        >
          Payment Successful ✅
        </h1>

        <p>
          Redirecting to KingCook...
        </p>

      </div>

    </div>
  );
}

export default PaymentSuccess;