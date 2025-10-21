import ThemedDatePicker from "@/components/Theme/Input/ThemedDatePicker";
import ThemedTextInput from "@/components/Theme/Input/ThemedTextInput";
import ThemedButton from "@/components/Theme/ThemedButton";
import ThemedText from "@/components/Theme/ThemedText";
import useThemeColors from "@/hooks/useThemeColors";
import { UserInterface } from "@/types/UserInterface";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function CreateParty() {
	const colors = useThemeColors();
	const router = useRouter();

	const [title, setTitle] = useState("");
	const [address, setAddress] = useState("");
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [members, setMembers] = useState<UserInterface[]>([]);

	const [errors, setErrors] = useState({
		title: "",
		address: "",
		date: "",
	});

	const validateForm = () => {
		const newErrors = {
			title: "",
			address: "",
			date: "",
		};

		if (!title.trim()) {
			newErrors.title = "Le titre est requis";
		}

		if (!address.trim()) {
			newErrors.address = "L'adresse est requise";
		}

		if (!date) {
			newErrors.date = "La date est requise";
		}

		setErrors(newErrors);

		return !newErrors.title && !newErrors.address && !newErrors.date;
	};

	const handleSubmit = () => {
		if (!validateForm()) {
			return;
		}

		// TODO: Send to API when backend is ready
		const partyData = {
			title,
			address,
			date: date?.toISOString(),
			members,
		};

		console.log("Party data to submit:", partyData);

		Alert.alert(
			"Succès",
			"La party a été créée avec succès !",
			[
				{
					text: "OK",
					onPress: () => router.back(),
				},
			],
		);
	};

	const handleAddMembers = () => {
		// TODO: Navigate to member selection screen
		Alert.alert(
			"En construction",
			"La sélection des membres sera disponible prochainement",
		);
	};

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		content: {
			flex: 1,
		},
		scrollContent: {
			padding: 20,
			gap: 20,
		},
		section: {
			gap: 12,
		},
		sectionTitle: {
			fontSize: 18,
			marginTop: 10,
		},
		membersContainer: {
			backgroundColor: colors.white,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			padding: 16,
			minHeight: 100,
			justifyContent: "center",
			alignItems: "center",
		},
		membersPlaceholder: {
			textAlign: "center",
			color: colors.paragraphDisabled,
		},
		membersList: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: 8,
		},
		memberChip: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: colors.secondary,
			paddingVertical: 6,
			paddingHorizontal: 12,
			borderRadius: 16,
			gap: 6,
		},
		buttonContainer: {
			padding: 20,
			gap: 12,
			backgroundColor: colors.white,
			borderTopWidth: 1,
			borderTopColor: colors.primary,
		},
	});

	return (
		<>
			<Stack.Screen
				options={{
					title: "Créer une party",
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
					headerTitleStyle: {
						fontFamily: "HossRound",
						fontSize: 18,
						textTransform: "uppercase",
					},
					headerShadowVisible: false,
				}}
			/>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<BottomSheetModalProvider>
					<KeyboardAvoidingView
						style={styles.container}
						behavior={Platform.OS === "ios" ? "padding" : "height"}
					>
						<ScrollView
							style={styles.content}
							contentContainerStyle={styles.scrollContent}
						>
							<View style={styles.section}>
								<ThemedText variant="h2" style={styles.sectionTitle}>
									Informations principales
								</ThemedText>
								<ThemedTextInput
									label="Titre de la party"
									placeholder="Ex: Anniversaire de Marie"
									value={title}
									onChangeText={(text) => {
										setTitle(text);
										setErrors({ ...errors, title: "" });
									}}
									error={errors.title}
									autoFocus
								/>
								<ThemedTextInput
									label="Adresse"
									placeholder="Ex: 123 rue de la Fête, Paris"
									value={address}
									onChangeText={(text) => {
										setAddress(text);
										setErrors({ ...errors, address: "" });
									}}
									error={errors.address}
									multiline
									numberOfLines={2}
								/>
								<ThemedDatePicker
									label="Date et heure"
									placeholder="Sélectionner une date"
									value={date}
									onChange={(selectedDate) => {
										setDate(selectedDate);
										setErrors({ ...errors, date: "" });
									}}
									error={errors.date}
									mode="datetime"
								/>
							</View>

							<View style={styles.section}>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<ThemedText variant="h2" style={styles.sectionTitle}>
										Participants
									</ThemedText>
									<Pressable onPress={handleAddMembers}>
										<FontAwesome6
											name="plus-circle"
											size={28}
											color={colors.primary}
										/>
									</Pressable>
								</View>
								<View style={styles.membersContainer}>
									{members.length === 0 ? (
										<ThemedText style={styles.membersPlaceholder}>
											Aucun participant ajouté.{"\n"}
											Appuyez sur + pour en ajouter
										</ThemedText>
									) : (
										<View style={styles.membersList}>
											{members.map((member) => (
												<View
													key={member.id}
													style={styles.memberChip}
												>
													<ThemedText>
														{member.firstname}{" "}
														{member.lastname}
													</ThemedText>
													<Pressable
														onPress={() => {
															setMembers(
																members.filter(
																	(m) =>
																		m.id !==
																		member.id,
																),
															);
														}}
													>
														<FontAwesome6
															name="times"
															size={14}
															color={colors.primary}
														/>
													</Pressable>
												</View>
											))}
										</View>
									)}
								</View>
								<ThemedText
									style={{
										fontSize: 14,
										color: colors.paragraphDisabled,
										fontStyle: "italic",
									}}
								>
									Note: Vous pourrez gérer la liste de courses après
									la création de la party
								</ThemedText>
							</View>
						</ScrollView>

						<View style={styles.buttonContainer}>
							<ThemedButton text="Créer la party" onPress={handleSubmit} />
							<ThemedButton
								text="Annuler"
								variant="primary2"
								onPress={() => router.back()}
							/>
						</View>
					</KeyboardAvoidingView>
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</>
	);
}
