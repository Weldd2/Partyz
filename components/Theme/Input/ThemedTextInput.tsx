import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { StyleSheet, TextInput, View } from "react-native";
import ThemedText from "../ThemedText";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			width: "100%",
		},
		label: {
			fontSize: 14,
			marginBottom: 8,
			color: colors.paragraphDisabled,
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
	useBottomSheetInput?: boolean; // Nouvelle prop
};

export default function ThemedTextInput({
	label,
	error,
	containerStyle,
	disabled = false,
	useBottomSheetInput = false,
	...rest
}: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);

	// Choisir le bon composant
	const InputComponent = useBottomSheetInput
		? BottomSheetTextInput
		: TextInput;

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
				<InputComponent
					{...rest}
					style={[styles.input, rest.style]}
					placeholderTextColor={colors.paragraphDisabled}
					editable={!disabled}
					autoFocus={false}
				/>
			</View>
			{error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
		</View>
	);
}
