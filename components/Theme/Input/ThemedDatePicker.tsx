import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View, ScrollView } from "react-native";
import ThemedText from "../ThemedText";
import ThemedButton from "../ThemedButton";

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
			justifyContent: "center",
			alignItems: "center",
			padding: 20,
		},
		modalContent: {
			backgroundColor: colors.white,
			borderRadius: 8,
			padding: 20,
			width: "100%",
			maxWidth: 400,
			borderWidth: 2,
			borderColor: colors.primary,
			maxHeight: "80%",
		},
		modalButtons: {
			flexDirection: "row",
			justifyContent: "flex-end",
			gap: 10,
			marginTop: 20,
		},
		pickerRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			gap: 10,
			marginVertical: 10,
		},
		pickerColumn: {
			flex: 1,
		},
		pickerButton: {
			paddingVertical: 8,
			paddingHorizontal: 12,
			borderRadius: 4,
			borderWidth: 1,
			borderColor: colors.primary,
			marginBottom: 8,
		},
		pickerButtonActive: {
			backgroundColor: colors.primary,
		},
		pickerText: {
			textAlign: "center",
		},
		pickerTextActive: {
			color: colors.white,
		},
		sectionTitle: {
			fontSize: 14,
			marginTop: 10,
			marginBottom: 5,
			color: colors.paragraphDisabled,
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

	const handleConfirm = () => {
		onChange(tempDate);
		setShowPicker(false);
	};

	const handleCancel = () => {
		setTempDate(value || new Date());
		setShowPicker(false);
	};

	const days = Array.from({ length: 31 }, (_, i) => i + 1);
	const months = [
		"Janvier",
		"Février",
		"Mars",
		"Avril",
		"Mai",
		"Juin",
		"Juillet",
		"Août",
		"Septembre",
		"Octobre",
		"Novembre",
		"Décembre",
	];
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const minutes = [0, 15, 30, 45];

	return (
		<View style={[styles.container, containerStyle]}>
			{label && <ThemedText style={styles.label}>{label}</ThemedText>}
			<Pressable
				onPress={() => setShowPicker(true)}
				style={[styles.inputContainer, error ? styles.error : undefined]}
			>
				<ThemedText
					style={value ? styles.valueText : styles.placeholder}
				>
					{value ? formatDate(value) : placeholder}
				</ThemedText>
				<FontAwesome name="calendar" size={20} color={colors.primary} />
			</Pressable>
			{error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

			<Modal
				visible={showPicker}
				transparent
				animationType="fade"
				onRequestClose={handleCancel}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<ThemedText variant="h2" style={{ textAlign: "center" }}>
							{mode === "time"
								? "Heure"
								: mode === "date"
									? "Date"
									: "Date et heure"}
						</ThemedText>

						<ScrollView style={{ maxHeight: 400 }}>
							{(mode === "date" || mode === "datetime") && (
								<>
									<ThemedText style={styles.sectionTitle}>
										Jour
									</ThemedText>
									<View
										style={{
											flexDirection: "row",
											flexWrap: "wrap",
											gap: 8,
										}}
									>
										{days.map((day) => {
											const isActive =
												tempDate.getDate() === day;
											return (
												<Pressable
													key={day}
													onPress={() => {
														const newDate =
															new Date(tempDate);
														newDate.setDate(day);
														setTempDate(newDate);
													}}
													style={[
														styles.pickerButton,
														{
															width: 45,
															height: 45,
														},
														isActive &&
															styles.pickerButtonActive,
													]}
												>
													<ThemedText
														style={[
															styles.pickerText,
															isActive &&
																styles.pickerTextActive,
														]}
													>
														{day}
													</ThemedText>
												</Pressable>
											);
										})}
									</View>

									<ThemedText style={styles.sectionTitle}>
										Mois
									</ThemedText>
									<View style={{ gap: 8 }}>
										{months.map((month, index) => {
											const isActive =
												tempDate.getMonth() === index;
											return (
												<Pressable
													key={month}
													onPress={() => {
														const newDate =
															new Date(tempDate);
														newDate.setMonth(index);
														setTempDate(newDate);
													}}
													style={[
														styles.pickerButton,
														isActive &&
															styles.pickerButtonActive,
													]}
												>
													<ThemedText
														style={[
															styles.pickerText,
															isActive &&
																styles.pickerTextActive,
														]}
													>
														{month}
													</ThemedText>
												</Pressable>
											);
										})}
									</View>

									<ThemedText style={styles.sectionTitle}>
										Année
									</ThemedText>
									<View style={{ gap: 8 }}>
										{years.map((year) => {
											const isActive =
												tempDate.getFullYear() === year;
											return (
												<Pressable
													key={year}
													onPress={() => {
														const newDate =
															new Date(tempDate);
														newDate.setFullYear(
															year,
														);
														setTempDate(newDate);
													}}
													style={[
														styles.pickerButton,
														isActive &&
															styles.pickerButtonActive,
													]}
												>
													<ThemedText
														style={[
															styles.pickerText,
															isActive &&
																styles.pickerTextActive,
														]}
													>
														{year}
													</ThemedText>
												</Pressable>
											);
										})}
									</View>
								</>
							)}

							{(mode === "time" || mode === "datetime") && (
								<>
									<ThemedText style={styles.sectionTitle}>
										Heure
									</ThemedText>
									<View
										style={{
											flexDirection: "row",
											flexWrap: "wrap",
											gap: 8,
										}}
									>
										{hours.map((hour) => {
											const isActive =
												tempDate.getHours() === hour;
											return (
												<Pressable
													key={hour}
													onPress={() => {
														const newDate =
															new Date(tempDate);
														newDate.setHours(hour);
														setTempDate(newDate);
													}}
													style={[
														styles.pickerButton,
														{
															width: 55,
															height: 45,
														},
														isActive &&
															styles.pickerButtonActive,
													]}
												>
													<ThemedText
														style={[
															styles.pickerText,
															isActive &&
																styles.pickerTextActive,
														]}
													>
														{hour
															.toString()
															.padStart(2, "0")}
														h
													</ThemedText>
												</Pressable>
											);
										})}
									</View>

									<ThemedText style={styles.sectionTitle}>
										Minutes
									</ThemedText>
									<View
										style={{
											flexDirection: "row",
											gap: 8,
										}}
									>
										{minutes.map((minute) => {
											const isActive =
												tempDate.getMinutes() ===
												minute;
											return (
												<Pressable
													key={minute}
													onPress={() => {
														const newDate =
															new Date(tempDate);
														newDate.setMinutes(
															minute,
														);
														setTempDate(newDate);
													}}
													style={[
														styles.pickerButton,
														{ flex: 1, height: 45 },
														isActive &&
															styles.pickerButtonActive,
													]}
												>
													<ThemedText
														style={[
															styles.pickerText,
															isActive &&
																styles.pickerTextActive,
														]}
													>
														{minute
															.toString()
															.padStart(2, "0")}
													</ThemedText>
												</Pressable>
											);
										})}
									</View>
								</>
							)}
						</ScrollView>

						<View style={styles.modalButtons}>
							<ThemedButton
								text="Annuler"
								variant="primary2"
								onPress={handleCancel}
							/>
							<ThemedButton
								text="Confirmer"
								onPress={handleConfirm}
							/>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}
