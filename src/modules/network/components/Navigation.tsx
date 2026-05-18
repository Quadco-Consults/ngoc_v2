import { Paper, Typography } from "@mui/material";
import clsx from "clsx";
import { NavLink, useSearchParams } from "react-router-dom";
import { PIPLELINE_NETWORK_ROUTES } from "../../../routes/routes";

export default function Navigation() {
    const [searchParams] = useSearchParams();

    return (
        <Paper
            variant="outlined"
            className="grid grid-cols-2 rounded-md overflow-hidden"
        >
            {[
                {
                    children: "Network",
                    to: PIPLELINE_NETWORK_ROUTES.PIPELINE_NETWORk.concat(
                        "?",
                        searchParams.toString()
                    ),
                },
                {
                    children: "Incident Report",
                    to: PIPLELINE_NETWORK_ROUTES.INCIDENT_REPORT.concat(
                        "?",
                        searchParams.toString()
                    ),
                },
            ].map(({ children, ...linkProps }, index) => {
                return (
                    <NavLink
                        key={index}
                        className={({ isActive, ...restRenderProps }) =>
                            clsx(
                                "flex items-center justify-center text-left gap-2 px-2 py-2 no-underline",
                                isActive
                                    ? "bg-primary-500 text-white"
                                    : "text-text-secondary",
                                // @ts-ignore
                                typeof linkProps?.className === "function"
                                    ? // @ts-ignore
                                      linkProps?.className?.({
                                          isActive,
                                          ...restRenderProps,
                                      })
                                    : // @ts-ignore
                                      linkProps?.className
                            )
                        }
                        {...linkProps}
                    >
                        {(renderProps) => (
                            <>
                                <Typography
                                    component="span"
                                    className="font-medium text-center"
                                >
                                    {typeof children === "function"
                                        ? // @ts-ignore
                                          children(renderProps)
                                        : children}
                                </Typography>
                            </>
                        )}
                    </NavLink>
                );
            })}
        </Paper>
    );
}
