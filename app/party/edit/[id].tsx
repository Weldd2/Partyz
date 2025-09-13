import ThemedDatePicker from "@/components/Theme/Input/ThemedDatePicker";
import ThemedTextInput from "@/components/Theme/Input/ThemedTextInput";
import ThemedButton from "@/components/Theme/ThemedButton";
import ThemedText from "@/components/Theme/ThemedText";
import partiesFixture from "@/fixtures/parties";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function EditParty() {
	const colors = useThemeColors();
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();

	const [title, setTitle] = useState("");
	const [address, setAddress] = useState("");
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);

	const [errors, setErrors] = useState({
		title: "",
		address: "",
		date: "",
	});

	useEffect(() => {
		// Load party data from fixtures (or API when ready)
		const party = partiesFixture.member.find((p) => p.id === id);
		if (party) {
			setTitle(party.title);
			setAddress(party.address);
			setDate(new Date(party.date));
		}
		setIsLoading(false);
	}, [id]);

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
			id,
			title,
			address,
			date: date?.toISOString(),
		};

		console.log("Party data to update:", partyData);

		Alert.alert("Succès", "La party a été modifiée avec succès !", [
			{
				text: "OK",
				onPress: () => router.back(),
			},
		]);
	};

	const handleManageMembers = () => {
		router.push(`/party/members/${id}`);
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
		manageButton: {
			paddingVertical: 14,
		},
		buttonContent: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: 10,
		},
		buttonText: {
			fontSize: 16,
			fontFamily: "HossRound-Bold",
		},
		helpText: {
			fontSize: 14,
			color: colors.paragraphDisabled,
			fontStyle: "italic",
			lineHeight: 20,
		},
		buttonContainer: {
			padding: 20,
			gap: 12,
			backgroundColor: colors.white,
			borderTopWidth: 1,
			borderTopColor: colors.primary,
		},
		loadingContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
	});

	if (isLoading) {
		return (
			<>
				<Stack.Screen
					options={{
						title: "Modifier la party",
						headerStyle: {
							backgroundColor: colors.primary,
						},
						headerTintColor: colors.white,
						headerTitleStyle: {
							fontFamily: "HossRound",
							fontSize: 18,
						},
						headerShadowVisible: false,
					}}
				/>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<BottomSheetModalProvider>
						<View style={[styles.container, styles.loadingContainer]}>
							<ThemedText>Chargement...</ThemedText>
						</View>
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</>
		);
	}

	return (
		<>
			<Stack.Screen
				options={{
					title: "Modifier la party",
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.white,
					headerTitleStyle: {
						fontFamily: "HossRound",
						fontSize: 18,
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
						<ThemedText variant="h2" style={styles.sectionTitle}>
							Participants et invitations
						</ThemedText>
						<ThemedButton
							variant="primary2"
							onPress={handleManageMembers}
							style={styles.manageButton}
						>
							<View style={styles.buttonContent}>
								<FontAwesome6
									name="user-group"
									size={18}
									color={colors.primary}
								/>
								<ThemedText
									style={styles.buttonText}
									color="primary"
								>
									Gérer les participants
								</ThemedText>
							</View>
						</ThemedButton>
						<ThemedText style={styles.helpText}>
							Invitez des amis, gérez les participants confirmés et
							suivez les invitations en attente
						</ThemedText>
					</View>
				</ScrollView>

				<View style={styles.buttonContainer}>
					<ThemedButton
						text="Enregistrer les modifications"
						onPress={handleSubmit}
					/>
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
