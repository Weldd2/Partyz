import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import ThemedText from "./Theme/ThemedText";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			width: "100%",
			gap: 10,
		},
		label: {
			fontSize: 16,
			marginBottom: 8,
			color: colors.paragraph,
		},
		inputContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			gap: 10,
		},
		input: {
			flex: 1,
			height: 60,
			borderWidth: 2,
			borderColor: colors.primary,
			borderRadius: 8,
			textAlign: "center",
			fontSize: 24,
			fontFamily: "HossRound-Bold",
			backgroundColor: colors.white,
			color: colors.paragraph,
		},
		inputFocused: {
			borderColor: colors.secondary,
			backgroundColor: colors.background,
		},
		inputFilled: {
			borderColor: colors.green,
		},
		error: {
			borderColor: colors.red,
		},
		errorText: {
			color: colors.red,
			fontSize: 14,
			marginTop: 4,
		},
	});

type Props = {
	length?: number;
	value: string;
	onChange: (code: string) => void;
	label?: string;
	error?: string;
	onComplete?: (code: string) => void;
};

export default function OTPInput({
	length = 6,
	value,
	onChange,
	label,
	error,
	onComplete,
}: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
	const inputRefs = useRef<(TextInput | null)[]>([]);

	const digits = value.split("");

	useEffect(() => {
		if (value.length === length && onComplete) {
			onComplete(value);
		}
	}, [value, length, onComplete]);

	const handleChange = (text: string, index: number) => {
		// Only accept numbers
		const numericText = text.replace(/[^0-9]/g, "");

		if (numericText.length === 0) {
			// Handle deletion
			const newDigits = [...digits];
			newDigits[index] = "";
			onChange(newDigits.join(""));

			// Move to previous input
			if (index > 0) {
				inputRefs.current[index - 1]?.focus();
			}
		} else if (numericText.length === 1) {
			// Handle single digit input
			const newDigits = [...digits];
			newDigits[index] = numericText;
			onChange(newDigits.join(""));

			// Move to next input
			if (index < length - 1) {
				inputRefs.current[index + 1]?.focus();
			}
		} else if (numericText.length > 1) {
			// Handle paste
			const newDigits = numericText.slice(0, length).split("");
			while (newDigits.length < length) {
				newDigits.push("");
			}
			onChange(newDigits.join(""));

			// Focus the next empty input or the last one
			const nextEmptyIndex = newDigits.findIndex((d) => d === "");
			if (nextEmptyIndex !== -1) {
				inputRefs.current[nextEmptyIndex]?.focus();
			} else {
				inputRefs.current[length - 1]?.focus();
			}
		}
	};

	const handleKeyPress = (e: any, index: number) => {
		if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	return (
		<View style={styles.container}>
			{label && <ThemedText style={styles.label}>{label}</ThemedText>}
			<View style={styles.inputContainer}>
				{Array.from({ length }, (_, index) => {
					const isFocused = focusedIndex === index;
					const isFilled = !!digits[index];

					return (
						<TextInput
							key={index}
							ref={(ref) => {
								inputRefs.current[index] = ref;
							}}
							style={[
								styles.input,
								isFocused && styles.inputFocused,
								isFilled && styles.inputFilled,
								error && styles.error,
							]}
							value={digits[index] || ""}
							onChangeText={(text) => handleChange(text, index)}
							onKeyPress={(e) => handleKeyPress(e, index)}
							onFocus={() => setFocusedIndex(index)}
							onBlur={() => setFocusedIndex(null)}
							keyboardType="number-pad"
							maxLength={1}
							selectTextOnFocus
						/>
					);
				})}
			</View>
			{error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
		</View>
	);
}
