import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import ThemedButton from "../ThemedButton";
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
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			minHeight: 48,
		},
		placeholder: {
			color: colors.paragraphDisabled,
		},
		valueText: {
			fontSize: 16,
			color: colors.paragraph,
		},
		error: {
			borderColor: colors.red,
		},
		errorText: {
			color: colors.red,
			fontSize: 14,
			marginTop: 4,
		},
		modalOverlay: {
			flex: 1,
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			justifyContent: "flex-end",
		},
		modalContent: {
			backgroundColor: colors.white,
			borderTopLeftRadius: 20,
			borderTopRightRadius: 20,
			padding: 20,
			paddingBottom: 40,
		},
		modalHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 20,
		},
	});

type Props = {
	label?: string;
	value?: Date;
	onChange: (date: Date) => void;
	error?: string;
	containerStyle?: any;
	placeholder?: string;
	mode?: "date" | "time" | "datetime";
};

export default function ThemedDatePicker({
	label,
	value,
	onChange,
	error,
	containerStyle,
	placeholder = "Sélectionner une date",
	mode = "datetime",
}: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);
	const [showPicker, setShowPicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [tempDate, setTempDate] = useState(value || new Date());

	const formatDate = (date: Date) => {
		if (mode === "time") {
			return date.toLocaleTimeString("fr-FR", {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else if (mode === "date") {
			return date.toLocaleDateString("fr-FR", {
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		} else {
			return date.toLocaleString("fr-FR", {
				day: "numeric",
				month: "long",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		}
	};

	const handleDateChange = (_event: any, selectedDate?: Date) => {
		if (Platform.OS === "android") {
			setShowPicker(false);
			if (selectedDate) {
				if (mode === "datetime") {
					// On Android, for datetime mode, first show date picker, then time picker
					setTempDate(selectedDate);
					setShowTimePicker(true);
				} else {
					onChange(selectedDate);
				}
			}
		} else {
			// On iOS, update the temp date as user scrolls
			if (selectedDate) {
				setTempDate(selectedDate);
			}
		}
	};

	const handleTimeChange = (_event: any, selectedDate?: Date) => {
		setShowTimePicker(false);
		if (selectedDate) {
			onChange(selectedDate);
		}
	};

	const handleConfirm = () => {
		onChange(tempDate);
		setShowPicker(false);
	};

	const handleCancel = () => {
		setTempDate(value || new Date());
		setShowPicker(false);
	};

	const handlePress = () => {
		setTempDate(value || new Date());
		setShowPicker(true);
	};

	// On Android, the picker shows as a dialog automatically
	const renderAndroidPicker = () => {
		if (!showPicker && !showTimePicker) return null;

		if (showTimePicker) {
			return (
				<DateTimePicker
					value={tempDate}
					mode="time"
					is24Hour={true}
					display="default"
					onChange={handleTimeChange}
				/>
			);
		}

		return (
			<DateTimePicker
				value={tempDate}
				mode={mode === "datetime" ? "date" : mode}
				is24Hour={true}
				display="default"
				onChange={handleDateChange}
			/>
		);
	};

	// On iOS, we show the picker in a modal at the bottom
	const renderIOSPicker = () => {
		if (!showPicker) return null;

		return (
			<Modal
				visible={showPicker}
				transparent
				animationType="slide"
				onRequestClose={handleCancel}
			>
				<Pressable style={styles.modalOverlay} onPress={handleCancel}>
					<Pressable onPress={(e) => e.stopPropagation()}>
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<ThemedButton
									text="Annuler"
									variant="primary2"
									onPress={handleCancel}
								/>
								<ThemedText variant="h2">
									{mode === "time"
										? "Heure"
										: mode === "date"
											? "Date"
											: "Date et heure"}
								</ThemedText>
								<ThemedButton
									text="Confirmer"
									onPress={handleConfirm}
								/>
							</View>
							<View
								style={{
									width: "100%",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<DateTimePicker
									value={tempDate}
									mode={mode}
									textColor={colors.primary}
									is24Hour={true}
									locale="FR-fr"
									display="spinner"
									onChange={handleDateChange}
								/>
							</View>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
		);
	};

	return (
		<View style={[styles.container, containerStyle]}>
			{label && <ThemedText style={styles.label}>{label}</ThemedText>}
			<Pressable
				onPress={handlePress}
				style={[
					styles.inputContainer,
					error ? styles.error : undefined,
				]}
			>
				<ThemedText
					style={value ? styles.valueText : styles.placeholder}
				>
					{value ? formatDate(value) : placeholder}
				</ThemedText>
				<FontAwesome6
					name="calendar"
					size={20}
					color={colors.primary}
				/>
			</Pressable>
			{error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

			{Platform.OS === "ios" ? renderIOSPicker() : renderAndroidPicker()}
		</View>
	);
}
