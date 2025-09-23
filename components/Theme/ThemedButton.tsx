import ThemedText from "@/components/Theme/ThemedText";
import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
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
	},
	secondary: {
		btn: {},
		text: {},
	},
	primary2: {
		btn: {
			// backgroundColor: colors.primary,
			borderColor: colors.primary,
			borderWidth: 1,
		},
		text: {
			color: colors.primary,
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
				{
					opacity: pressed ? 0.9 : 1,
				},
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
