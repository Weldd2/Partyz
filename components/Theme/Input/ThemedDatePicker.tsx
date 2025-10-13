import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import { Keyboard, Platform, Pressable, StyleSheet, View } from "react-native";
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
		contentContainer: {
			paddingHorizontal: 20,
			paddingBottom: 40,
		},
		header: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 20,
		},
		pickerContainer: {
			width: "100%",
			justifyContent: "center",
			alignItems: "center",
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
	const bottomSheetRef = useRef<BottomSheetModal>(null);
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

	const handleConfirm = useCallback(() => {
		onChange(tempDate);
		bottomSheetRef.current?.dismiss();
	}, [tempDate, onChange]);

	const handleCancel = useCallback(() => {
		setTempDate(value || new Date());
		bottomSheetRef.current?.dismiss();
	}, [value]);

	const handlePress = useCallback(() => {
		Keyboard.dismiss();
		setTempDate(value || new Date());
		if (Platform.OS === "ios") {
			bottomSheetRef.current?.present();
		} else {
			setShowPicker(true);
		}
	}, [value]);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.5}
				pressBehavior="close"
			/>
		),
		[],
	);

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

	// On iOS, we show the picker in a bottom sheet modal
	const renderIOSBottomSheet = () => {
		return (
			<BottomSheetModal
				ref={bottomSheetRef}
				snapPoints={["50%"]}
				enablePanDownToClose
				onDismiss={handleCancel}
				backdropComponent={renderBackdrop}
				backgroundStyle={{
					backgroundColor: colors.white,
				}}
				handleIndicatorStyle={{
					backgroundColor: colors.paragraphDisabled,
				}}
				keyboardBehavior="extend"
				keyboardBlurBehavior="restore"
			>
				<BottomSheetView style={styles.contentContainer}>
					<View style={styles.header}>
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
						<ThemedButton text="Confirmer" onPress={handleConfirm} />
					</View>
					<View style={styles.pickerContainer}>
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
				</BottomSheetView>
			</BottomSheetModal>
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

			{Platform.OS === "ios" ? renderIOSBottomSheet() : renderAndroidPicker()}
		</View>
	);
}
