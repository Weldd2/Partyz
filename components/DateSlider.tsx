import { View, Text, StyleSheet, Dimensions } from "react-native";
import useThemeColors from "@/hooks/useThemeColors";
import { Colors } from "@/constants/colors";
import Carousel from "@/components/Carousel";

const data = [...new Array(6).keys()];
const width = Dimensions.get("window").width;

function DateSlider() {
	const colors = useThemeColors();
	const styles = getStyles(colors);

	return (
		<View>
			<Carousel
				style={styles.carousel}
				data={data}
				itemWidth={80}
				renderItem={({ index }) => (
					<View style={styles.slide}>
						<Text style={{ textAlign: "center", fontSize: 30 }}>
							{index}
						</Text>
					</View>
				)}
			/>
		</View>
	);
}

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		carousel: {
			width: "100%",
			height: 80,
			margin: 10,
		},
		slide: {
			backgroundColor: colors.white,
			borderWidth: 1,
			borderColor: colors.primary,
			height: 80,
			width: 80,
			borderRadius: 8,
			justifyContent: "center",
			padding: 8,
			gap: 0,
			shadowColor: colors.primary,
			shadowOffset: { width: 1, height: 1 },
			shadowOpacity: 1,
			shadowRadius: 0,
		},
		monthText: {
			fontSize: 24,
			fontFamily: "HossRound-Bold",
			color: colors.primary,
		},
		yearText: {
			fontSize: 16,
			color: colors.primary,
		},
	});

export default DateSlider;
