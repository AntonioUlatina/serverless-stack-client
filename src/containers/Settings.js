import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Elements, StripeProvider } from "react-stripe-elements";
import { API } from "aws-amplify";
import BillingForm from "../components/BillingForm";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./Settings.css";

export default function Settings() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    // setStripe(window.Stripe(config.STRIPE_KEY));
    setStripe(window.Stripe("pk_test_elzqTzdH655jgbvWMue4mplb00m8uTNt5n"));
  }, []);

  function billUser(details) {
    return API.post("notes", "billing", {
      body: details,
    });
  }

  async function handleFormSubmit(storage, { token, error }) {
    if (error) {
      //   onError(error);
      onError("Handle Form Submit");
      alert(token, error.STRIPE_KEY);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });

      alert("Your card has been charged successfully!");
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Settings">
      <StripeProvider stripe={stripe}>
        <Elements>
          <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
        </Elements>
      </StripeProvider>
    </div>
  );
}
