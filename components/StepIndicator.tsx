import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { StyleSheet, View } from "react-native";
import ThemedText from "./Theme/ThemedText";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			paddingVertical: 20,
			gap: 8,
		},
		stepContainer: {
			alignItems: "center",
			gap: 8,
		},
		step: {
			width: 40,
			height: 40,
			borderRadius: 20,
			borderWidth: 2,
			borderColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: colors.white,
		},
		stepActive: {
			backgroundColor: colors.primary,
		},
		stepCompleted: {
			backgroundColor: colors.green,
			borderColor: colors.green,
		},
		stepText: {
			fontSize: 16,
			fontWeight: "bold",
		},
		stepTextActive: {
			color: colors.white,
		},
		stepLabel: {
			fontSize: 12,
			textAlign: "center",
		},
		connector: {
			width: 30,
			height: 2,
			backgroundColor: colors.paragraphDisabled,
			marginTop: -24,
		},
		connectorActive: {
			backgroundColor: colors.primary,
		},
		connectorCompleted: {
			backgroundColor: colors.green,
		},
	});

type Props = {
	steps: string[];
	currentStep: number;
	completedSteps?: number[];
};

export default function StepIndicator({
	steps,
	currentStep,
	completedSteps = [],
}: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);

	return (
		<View style={styles.container}>
			{steps.map((step, index) => {
				const isActive = currentStep === index;
				const isCompleted =
					completedSteps.includes(index) || currentStep > index;

				return (
					<View
						key={index}
						style={{ flexDirection: "row", alignItems: "center" }}
					>
						<View style={styles.stepContainer}>
							<View
								style={[
									styles.step,
									isActive && styles.stepActive,
									isCompleted && styles.stepCompleted,
								]}
							>
								<ThemedText
									style={[
										styles.stepText,
										{
											color: isActive || isCompleted
												? colors.white
												: colors.primary,
										},
									]}
								>
									{index + 1}
								</ThemedText>
							</View>
							<ThemedText
								style={[
									styles.stepLabel,
									{
										color: isActive
											? colors.primary
											: colors.paragraphDisabled,
										fontFamily: isActive
											? "HossRound-Bold"
											: "HossRound",
									},
								]}
							>
								{step}
							</ThemedText>
						</View>
						{index < steps.length - 1 && (
							<View
								style={[
									styles.connector,
									currentStep > index &&
										styles.connectorCompleted,
								]}
							/>
						)}
					</View>
				);
			})}
		</View>
	);
}
