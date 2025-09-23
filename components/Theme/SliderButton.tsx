import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { Pressable, StyleSheet } from "react-native";
import ThemedText from "./ThemedText";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		btn: {
			flex: 1,
			alignItems: "center",
			backgroundColor: colors.white,
			padding: 10,
			borderRadius: 6,
		},
		btnActive: {
			backgroundColor: colors.primary,
		},
	});

type Props = {
	text: string;
	isActive?: boolean;
	onPress?: () => void;
};

export default function SliderButton({
	text,
	isActive = false,
	onPress,
}: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);

	return (
		<Pressable
			onPress={onPress}
			style={[styles.btn, isActive && styles.btnActive]}
		>
			<ThemedText color={isActive ? "white" : "primary"}>
				{text}
			</ThemedText>
		</Pressable>
	);
}
