import { Colors } from "@/constants/colors";
import { useColorScheme } from "react-native";

export default function useThemeColors() {
	const theme = useColorScheme() ?? "light";
	return Colors[theme];
}
