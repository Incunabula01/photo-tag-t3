import React from "react";

const icons = require("./assets");

type IconName =
    | "logo"
    | "logo-small"
    | "more"
    | "explore-active"
    | "explore"
    | "home-active"
    | "home"
    | "messages-active"
    | "messages"
    | "notifications";

const Icon = ({
    name,
    ...props
}: {
    name: IconName;
    fill: string;
    style?: any;
    width?: number;
    height?: number;
}) => {
    const IconComponent = React.useMemo(() => {
        const importIcons = icons(`./${name}.svg`);
        if (!importIcons) {
            throw new Error(
                `Icon not found: ${name}. Options: ${icons.keys().join(", ")}}`
            );
        }
        return importIcons.default;
    }, [name]);
    return <IconComponent {...props} color={props.fill} />;
}

export default Icon;