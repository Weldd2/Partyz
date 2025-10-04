import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { Text } from "react-native";

const getVariantStyle = (colors: typeof Colors.light) => ({
	global: {
		color: colors.paragraph,
		fontFamily: "HossRound",
	},
	h1: {
		fontFamily: "HossRound-Bold",
		fontSize: 24,
	},
	h2: {
		fontFamily: "HossRound-Bold",
		fontSize: 20,
	},
	h3: {
		fontFamily: "HossRound-Medium",
		color: colors.white,
		fontSize: 20,
	},
	disabled: {
		fontFamily: "HossRound-Regular",
		color: colors.paragraphDisabled,
		fontSize: 14,
	},
});

type Props = React.ComponentProps<typeof Text> & {
	variant?: keyof ReturnType<typeof getVariantStyle>;
	color?: keyof typeof Colors.light;
};

export default function ThemedText({
	variant = "global",
	color,
	...rest
}: Props) {
	const colors = useThemeColors();
	const styles = getVariantStyle(colors);
	return (
		<Text
			{...rest}
			style={[
				styles.global,
				styles[variant],
				color ? { color: colors[color] } : null,
				rest.style,
			]}
		/>
	);
}
