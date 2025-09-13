import OTPInput from "@/components/OTPInput";
import StepIndicator from "@/components/StepIndicator";
import ThemedTextInput from "@/components/Theme/Input/ThemedTextInput";
import ThemedButton from "@/components/Theme/ThemedButton";
import ThemedText from "@/components/Theme/ThemedText";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";

export default function Login() {
	const colors = useThemeColors();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);

	// Step 1: Phone number
	const [phoneNumber, setPhoneNumber] = useState("");
	const [phoneError, setPhoneError] = useState("");

	// Step 2: OTP
	const [otp, setOtp] = useState("");
	const [otpError, setOtpError] = useState("");

	// Step 3: CGU
	const [cguAccepted, setCguAccepted] = useState(false);
	const [cguError, setCguError] = useState("");

	// Step 4: Profile picture
	const [profilePicture, setProfilePicture] = useState<string | null>(null);

	const steps = ["Téléphone", "Code", "CGU", "Photo"];

	const validatePhoneNumber = (phone: string) => {
		// Simple French phone number validation
		const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
		return phoneRegex.test(phone.replace(/\s/g, ""));
	};

	const handlePhoneSubmit = () => {
		if (!phoneNumber) {
			setPhoneError("Veuillez entrer un numéro de téléphone");
			return;
		}
		if (!validatePhoneNumber(phoneNumber)) {
			setPhoneError("Numéro de téléphone invalide");
			return;
		}
		setPhoneError("");
		setCurrentStep(1);
	};

	const handleOtpSubmit = () => {
		if (otp.length !== 6) {
			setOtpError("Le code doit contenir 6 chiffres");
			return;
		}
		setOtpError("");
		setCurrentStep(2);
	};

	const handleCguSubmit = () => {
		if (!cguAccepted) {
			setCguError("Vous devez accepter les CGU pour continuer");
			return;
		}
		setCguError("");
		setCurrentStep(3);
	};

	const handleSkipPhoto = () => {
		// Navigate to home or complete registration
		router.replace("/");
	};

	const handleCompleteRegistration = () => {
		// Navigate to home or complete registration
		router.replace("/");
	};

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled) {
			setProfilePicture(result.assets[0].uri);
		}
	};

	const takePhoto = async () => {
		const result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled) {
			setProfilePicture(result.assets[0].uri);
		}
	};

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		content: {
			flex: 1,
			padding: 20,
		},
		stepContent: {
			flex: 1,
			justifyContent: "center",
			gap: 20,
		},
		title: {
			textAlign: "center",
			marginBottom: 10,
		},
		subtitle: {
			textAlign: "center",
			color: colors.paragraphDisabled,
			marginBottom: 30,
		},
		checkboxContainer: {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: 12,
			padding: 16,
			backgroundColor: colors.white,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
		},
		checkboxContainerError: {
			borderColor: colors.red,
		},
		checkbox: {
			width: 24,
			height: 24,
			borderRadius: 4,
			borderWidth: 2,
			borderColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: colors.white,
		},
		checkboxChecked: {
			backgroundColor: colors.primary,
		},
		cguText: {
			flex: 1,
			fontSize: 14,
			lineHeight: 20,
		},
		cguLink: {
			color: colors.primary,
			textDecorationLine: "underline",
		},
		photoContainer: {
			alignItems: "center",
			gap: 20,
		},
		profilePicture: {
			width: 150,
			height: 150,
			borderRadius: 75,
			backgroundColor: colors.white,
			borderWidth: 3,
			borderColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
		},
		photoButtons: {
			width: "100%",
			gap: 12,
		},
		buttonContainer: {
			padding: 20,
			gap: 12,
		},
	});

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView style={styles.content}>
				<StepIndicator steps={steps} currentStep={currentStep} />

				{currentStep === 0 && (
					<View style={styles.stepContent}>
						<View>
							<ThemedText variant="h1" style={styles.title}>
								Bienvenue sur Partyz
							</ThemedText>
							<ThemedText style={styles.subtitle}>
								Entrez votre numéro de téléphone pour commencer
							</ThemedText>
						</View>
						<ThemedTextInput
							label="Numéro de téléphone"
							placeholder="+33 6 12 34 56 78"
							value={phoneNumber}
							onChangeText={(text) => {
								setPhoneNumber(text);
								setPhoneError("");
							}}
							error={phoneError}
							keyboardType="phone-pad"
							autoFocus
						/>
					</View>
				)}

				{currentStep === 1 && (
					<View style={styles.stepContent}>
						<View>
							<ThemedText variant="h1" style={styles.title}>
								Vérification
							</ThemedText>
							<ThemedText style={styles.subtitle}>
								Entrez le code à 6 chiffres envoyé au{" "}
								{phoneNumber}
							</ThemedText>
						</View>
						<OTPInput
							value={otp}
							onChange={(code) => {
								setOtp(code);
								setOtpError("");
							}}
							error={otpError}
							onComplete={(code) => {
								// Auto-submit when complete
								if (code.length === 6) {
									setTimeout(() => handleOtpSubmit(), 500);
								}
							}}
						/>
						<Pressable
							onPress={() => {
								// Resend OTP logic here
								console.log("Resend OTP");
							}}
						>
							<ThemedText
								style={{
									textAlign: "center",
									color: colors.primary,
									textDecorationLine: "underline",
								}}
							>
								Renvoyer le code
							</ThemedText>
						</Pressable>
					</View>
				)}

				{currentStep === 2 && (
					<View style={styles.stepContent}>
						<View>
							<ThemedText variant="h1" style={styles.title}>
								Conditions Générales
							</ThemedText>
							<ThemedText style={styles.subtitle}>
								Veuillez accepter les CGU pour continuer
							</ThemedText>
						</View>
						<Pressable
							onPress={() => {
								setCguAccepted(!cguAccepted);
								setCguError("");
							}}
							style={[
								styles.checkboxContainer,
								cguError ? styles.checkboxContainerError : null,
							]}
						>
							<View
								style={[
									styles.checkbox,
									cguAccepted && styles.checkboxChecked,
								]}
							>
								{cguAccepted && (
									<FontAwesome6
										name="check"
										size={16}
										color={colors.white}
									/>
								)}
							</View>
							<ThemedText style={styles.cguText}>
								J'accepte les{" "}
								<ThemedText style={styles.cguLink}>
									Conditions Générales d'Utilisation
								</ThemedText>{" "}
								et la{" "}
								<ThemedText style={styles.cguLink}>
									Politique de Confidentialité
								</ThemedText>{" "}
								de Partyz. Je comprends que mes données seront
								traitées conformément à ces documents.
							</ThemedText>
						</Pressable>
						{cguError && (
							<ThemedText
								style={{
									color: colors.red,
									fontSize: 14,
									textAlign: "center",
								}}
							>
								{cguError}
							</ThemedText>
						)}
					</View>
				)}

				{currentStep === 3 && (
					<View style={styles.stepContent}>
						<View>
							<ThemedText variant="h1" style={styles.title}>
								Photo de profil
							</ThemedText>
							<ThemedText style={styles.subtitle}>
								Ajoutez une photo de profil (optionnel)
							</ThemedText>
						</View>
						<View style={styles.photoContainer}>
							<View style={styles.profilePicture}>
								{profilePicture ? (
									<Image
										source={{ uri: profilePicture }}
										style={{
											width: 144,
											height: 144,
											borderRadius: 72,
										}}
									/>
								) : (
									<FontAwesome6
										name="user"
										size={60}
										color={colors.paragraphDisabled}
									/>
								)}
							</View>
							<View style={styles.photoButtons}>
								<ThemedButton
									text="Prendre une photo"
									onPress={takePhoto}
									variant="primary2"
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											gap: 10,
										}}
									>
										<FontAwesome6
											name="camera"
											size={20}
											color={colors.primary}
										/>
										<ThemedText
											style={{ color: colors.primary }}
										>
											Prendre une photo
										</ThemedText>
									</View>
								</ThemedButton>
								<ThemedButton
									text="Choisir une photo"
									onPress={pickImage}
									variant="primary2"
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											gap: 10,
										}}
									>
										<FontAwesome6
											name="image"
											size={20}
											color={colors.primary}
										/>
										<ThemedText
											style={{ color: colors.primary }}
										>
											Choisir une photo
										</ThemedText>
									</View>
								</ThemedButton>
							</View>
						</View>
					</View>
				)}
			</ScrollView>

			<View style={styles.buttonContainer}>
				{currentStep === 0 && (
					<ThemedButton
						text="Continuer"
						onPress={handlePhoneSubmit}
					/>
				)}
				{currentStep === 1 && (
					<View style={{ flexDirection: "row", gap: 12 }}>
						<View style={{ flex: 1 }}>
							<ThemedButton
								text="Retour"
								variant="primary2"
								onPress={() => setCurrentStep(0)}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<ThemedButton
								text="Vérifier"
								onPress={handleOtpSubmit}
							/>
						</View>
					</View>
				)}
				{currentStep === 2 && (
					<View style={{ flexDirection: "row", gap: 12 }}>
						<View style={{ flex: 1 }}>
							<ThemedButton
								text="Retour"
								variant="primary2"
								onPress={() => setCurrentStep(1)}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<ThemedButton
								text="Accepter"
								onPress={handleCguSubmit}
							/>
						</View>
					</View>
				)}
				{currentStep === 3 && (
					<View style={{ gap: 12 }}>
						<ThemedButton
							text={
								profilePicture
									? "Terminer"
									: "Passer cette étape"
							}
							onPress={
								profilePicture
									? handleCompleteRegistration
									: handleSkipPhoto
							}
						/>
						{!profilePicture && (
							<ThemedButton
								text="Retour"
								variant="primary2"
								onPress={() => setCurrentStep(2)}
							/>
						)}
					</View>
				)}
			</View>
		</KeyboardAvoidingView>
	);
}
