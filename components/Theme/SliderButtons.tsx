import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			flexDirection: "row",
			padding: 2,
			borderRadius: 8,
			backgroundColor: colors.white,
			borderWidth: 1,
			borderColor: colors.primary,
			gap: 2,
		},
	});

type Props = {
	children: React.ReactNode;
	defaultActive?: string;
	onActiveChange?: (key: string) => void;
};

export default function SliderButtons({
	children,
	defaultActive,
	onActiveChange,
}: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);
	const [activeKey, setActiveKey] = useState(defaultActive || "");

	const handlePress = (key: string) => {
		setActiveKey(key);
		onActiveChange?.(key);
	};

	return <View style={styles.container}>{children}</View>;
}
