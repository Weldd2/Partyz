import ThemedText from "@/components/Theme/ThemedText";
import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { colord } from "colord";
import { Pressable } from "react-native";

const getStyles = (colors: typeof Colors.light) => ({
	btn: {
		with: "fit-content",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
	},
	text: {
		fontSize: 16,
	},
	disabled: { opacity: 0.8 },
});

const getVariantStyle = (colors: typeof Colors.light) => ({
	primary: {
		btn: {
			backgroundColor: colors.primary,
			borderColor: colors.primary,
		},
		text: {
			color: colors.white,
		},
		pressed: {
			backgroundColor: colord(colors.primary).lighten(0.04).toHex(),
		},
	},
	secondary: {
		btn: {},
		text: {},
		pressed: {},
	},
	primary2: {
		btn: {
			backgroundColor: colors.white,
			borderColor: colors.primary,
			borderWidth: 1,
		},
		text: {
			color: colors.primary,
		},
		pressed: {
			backgroundColor: colord(colors.white)
				.darken(0.05)
				.grayscale()
				.toHex(),
		},
	},
});

type Props = React.ComponentProps<typeof Pressable> & {
	variant?: keyof ReturnType<typeof getVariantStyle>;
	color?: keyof typeof Colors.light;
	onPress?: Function;
	text?: string;
	children?: React.ReactNode;
	disabled?: boolean;
	onPressAnimation?: boolean;
	onPressHaptic?: boolean;
};

export default function ThemedButton({
	text,
	children,
	onPress,
	variant = "primary",
	disabled = false,
	onPressAnimation = true,
	onPressHaptic = true,
	...rest
}: Props) {
	const colors = useThemeColors();
	const variantStyles = getVariantStyle(colors);
	const styles = getStyles(colors);

	return (
		<Pressable
			{...rest}
			style={({ pressed }: { pressed: boolean }) => [
				styles.btn,
				variantStyles[variant].btn,
				pressed ? variantStyles[variant].pressed : undefined,
				disabled ? styles.disabled : undefined,
				rest.style as any,
			]}
			onPress={disabled ? undefined : onPress}
			disabled={disabled}
		>
			{text ? (
				<ThemedText style={[styles.text, variantStyles[variant].text]}>
					{text}
				</ThemedText>
			) : (
				children
			)}
		</Pressable>
	);
}
