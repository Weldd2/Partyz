import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import ThemedCarousel from "./Theme/ThemedCarousel";
import ThemedText from "./Theme/ThemedText";

const generateMonths = () => {
	const months = [
		"Jan",
		"Fév",
		"Mars",
		"Avr",
		"Mai",
		"Juin",
		"Juil",
		"Août",
		"Sept",
		"Oct",
		"Nov",
		"Déc",
	];
	return Array.from({ length: 24 }).map((_, i) => {
		const year = 2025 + Math.floor(i / 12);
		const monthIndex = i % 12;
		return {
			key: `${months[monthIndex]}-${year}`,
			label: `${months[monthIndex]} ${year}`,
			month: `${months[monthIndex]}`,
			year: `${year}`,
		};
	});
};

type MonthData = {
	key: string;
	label: string;
	month: string;
	year: string;
};

type Props = {
	onDateChange?: (date: { month: string; year: string }) => void;
};

const DateSlider = ({ onDateChange }: Props) => {
	const colors = useThemeColors();
	const styles = getStyles(colors);
	const months = useMemo(() => generateMonths(), []);

	const handleDateChange = (item: MonthData) => {
		if (onDateChange) {
			onDateChange({
				month: item.month,
				year: item.year,
			});
		}
	};

	const renderMonthItem = (
		item: MonthData,
		_index: number,
		isSelected: boolean,
	) => {
		return (
			<View
				style={[
					styles.slide,
					{
						opacity: isSelected ? 1 : 0.6,
					},
				]}
			>
				<ThemedText style={[styles.yearText]}>{item.year}</ThemedText>
				<ThemedText style={[styles.monthText]} variant="h1">
					{item.month}
				</ThemedText>
			</View>
		);
	};

	return (
		<ThemedCarousel
			data={months}
			renderItem={renderMonthItem}
			onItemChange={handleDateChange}
			itemWidth={80}
			itemSpacing={10}
			initialIndex={0}
			enableInfiniteScroll={true}
		/>
	);
};

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
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
