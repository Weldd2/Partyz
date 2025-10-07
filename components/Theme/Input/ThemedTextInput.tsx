import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { StyleSheet, TextInput, View } from "react-native";
import ThemedText from "../ThemedText";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			width: "100%",
		},
		label: {
			fontSize: 16,
			marginBottom: 8,
			color: colors.paragraph,
		},
		inputContainer: {
			backgroundColor: colors.white,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			paddingHorizontal: 16,
			paddingVertical: 12,
		},
		input: {
			fontSize: 16,
			fontFamily: "HossRound",
			color: colors.paragraph,
			minHeight: 24,
		},
		error: {
			borderColor: colors.red,
		},
		errorText: {
			color: colors.red,
			fontSize: 14,
			marginTop: 4,
		},
		disabled: {
			backgroundColor: colors.background,
			opacity: 0.6,
		},
	});

type Props = React.ComponentProps<typeof TextInput> & {
	label?: string;
	error?: string;
	containerStyle?: any;
	disabled?: boolean;
};

export default function ThemedTextInput({
	label,
	error,
	containerStyle,
	disabled = false,
	...rest
}: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);

	return (
		<View style={[styles.container, containerStyle]}>
			{label && <ThemedText style={styles.label}>{label}</ThemedText>}
			<View
				style={[
					styles.inputContainer,
					error ? styles.error : undefined,
					disabled ? styles.disabled : undefined,
				]}
			>
				<TextInput
					{...rest}
					style={[styles.input, rest.style]}
					placeholderTextColor={colors.paragraphDisabled}
					editable={!disabled}
				/>
			</View>
			{error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
		</View>
	);
}
