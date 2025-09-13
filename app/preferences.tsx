import ThemedButton from "@/components/Theme/ThemedButton";
import ThemedText from "@/components/Theme/ThemedText";
import useThemeColors from "@/hooks/useThemeColors";
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

export default function Preferences() {
	const colors = useThemeColors();
	const router = useRouter();
	const [theme, setTheme] = useState("auto");

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
			fontFamily: "HossRound-Bold",
		},
		optionContainer: {
			backgroundColor: colors.white,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			padding: 16,
			gap: 12,
		},
		optionItem: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingVertical: 12,
			paddingHorizontal: 8,
		},
		optionLabel: {
			fontSize: 16,
			color: colors.paragraph,
		},
		selectedOption: {
			flexDirection: "row",
			alignItems: "center",
			gap: 8,
			backgroundColor: colors.secondary,
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 16,
		},
		buttonContainer: {
			padding: 20,
			gap: 12,
			backgroundColor: colors.white,
			borderTopWidth: 1,
			borderTopColor: colors.primary,
		},
		descriptionText: {
			fontSize: 14,
			color: colors.paragraphDisabled,
			fontStyle: "italic",
		},
	});

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme);
		// Theme will be controlled by system preferences
		// In a real app, you'd save this to AsyncStorage and apply it globally
		Alert.alert(
			"Thème mis à jour",
			`Le thème a été changé en: ${newTheme}`,
		);
	};

	const handleProfileEdit = () => {
		Alert.alert(
			"Profil utilisateur",
			"La page de modification de profil sera disponible prochainement",
		);
	};

	const themeOptions = [
		{
			label: "Automatique (système)",
			value: "auto",
			description: "Utilise les paramètres de votre appareil",
		},
		{
			label: "Clair",
			value: "light",
			description: "Toujours afficher le thème clair",
		},
		{
			label: "Sombre",
			value: "dark",
			description: "Toujours afficher le thème sombre",
		},
	];

	return (
		<>
			<Stack.Screen
				options={{
					title: "Préférences",
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
							Profil
						</ThemedText>
						<ThemedButton
							text="Modifier mon profil"
							variant="primary2"
							onPress={handleProfileEdit}
						/>
						<ThemedText style={styles.descriptionText}>
							Mettez à jour vos informations personnelles et vos paramètres de compte
						</ThemedText>
					</View>

					<View style={styles.section}>
						<ThemedText variant="h2" style={styles.sectionTitle}>
							Apparence
						</ThemedText>
						<ThemedText style={styles.descriptionText}>
							Choisissez comment vous souhaitez que l'application
							s'affiche
						</ThemedText>
						<View style={styles.optionContainer}>
							{themeOptions.map((option) => (
								<Pressable
									key={option.value}
									onPress={() => handleThemeChange(option.value)}
									style={[styles.optionItem]}
								>
									<View style={{ flex: 1 }}>
										<ThemedText style={styles.optionLabel}>
											{option.label}
										</ThemedText>
										<ThemedText style={styles.descriptionText}>
											{option.description}
										</ThemedText>
									</View>
									{theme === option.value && (
										<View style={styles.selectedOption}>
											<FontAwesome6
												name="check"
												size={16}
												color={colors.primary}
											/>
										</View>
									)}
								</Pressable>
							))}
						</View>
					</View>

					<View style={styles.section}>
						<ThemedText variant="h2" style={styles.sectionTitle}>
							À propos
						</ThemedText>
						<View style={styles.optionContainer}>
							<View style={styles.optionItem}>
								<ThemedText style={styles.optionLabel}>
									Version de l'application
								</ThemedText>
								<ThemedText style={styles.optionLabel}>
									1.0.0
								</ThemedText>
							</View>
						</View>
					</View>
				</ScrollView>

				<View style={styles.buttonContainer}>
					<ThemedButton
						text="Retour"
						variant="primary2"
						onPress={() => router.back()}
					/>
				</View>
			</KeyboardAvoidingView>
		</>
	);
}
