import { Typography, TypographyProps } from "@mui/material";
import currencyjs from "currency.js";
import { forwardRef } from "react";

const NumberTypography = forwardRef<HTMLSpanElement, TypographyProps>(
    function NumberTypography(props, ref) {
        const { children, ...rest } = props;

        const numericValue =
            typeof children === "number" || typeof children === "string"
                ? children
                : 0;

        return (
            <Typography ref={ref} {...rest}>
                {currencyjs(numericValue, {
                    precision: 0,
                    symbol: "",
                }).format()}
            </Typography>
        );
    }
);

export default NumberTypography;
