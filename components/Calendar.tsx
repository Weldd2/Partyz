import useThemeColors from "@/hooks/useThemeColors";
import { View } from "react-native";
import ThemedText from "./Theme/ThemedText";

export default function Calendar() {
	const colors = useThemeColors();
	return (
		<View
			style={{
				backgroundColor: colors.paragraphDisabled,
				height: 250,
				borderRadius: 8,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<ThemedText color="white">Calendrier</ThemedText>
		</View>
	);
}
