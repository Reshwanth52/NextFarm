import React, { Fragment } from "react";
import { Typography, Stepper, Step, StepLabel } from "@material-ui/core";
import { FaShippingFast } from "react-icons/fa";
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdLibraryAddCheck } from "react-icons/md";
import "./CheckOutSteps.css";

const CheckOutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: <Typography>Shipping Details</Typography>,
      icon: <FaShippingFast />,
    },
    {
      label: <Typography>Confirm Order</Typography>,
      icon: <MdLibraryAddCheck />,
    },
    {
      label: <Typography>Payment</Typography>,
      icon: <RiSecurePaymentFill />,
    },
  ];

  const stepStyles = {
    boxSizing: "border-box",
  };
  return (
    <Fragment>
      <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index) => (
          <Step
            key={index}
            active={activeStep === index ? true : false}
            completed={activeStep >= index ? true : false}
          >
            <StepLabel
              icon={item.icon}
              style={{
                color: activeStep >= index ? "tomato" : "rgba(0,0,0,0.649)",
              }}
            >
              {item.label}{" "}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Fragment>
  );
};

export default CheckOutSteps;
