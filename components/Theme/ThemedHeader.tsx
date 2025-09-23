import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.primary,
			height: 110,
			justifyContent: "flex-end",
			alignItems: "center",
		},
	});

type Props = {
	title: string;
};

export default function ThemedHeader({ title }: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);
	return (
		<View style={styles.container}>
			<ThemedText
				variant="h3"
				style={{
					paddingBottom: 20,
					textTransform: "uppercase",
				}}
			>
				{title}
			</ThemedText>
		</View>
	);
}
