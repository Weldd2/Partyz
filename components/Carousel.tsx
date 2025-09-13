import { FlatList, ViewToken, StyleSheet } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import ThemedText from "./Theme/ThemedText";

type MonthYear = {
	year: number;
	month: number;
	id: string;
};

const INITIAL_MONTHS_COUNT = 24;
const LOAD_MORE_THRESHOLD = 6;

const generateMonthId = (year: number, month: number) => `${year}-${month}`;

const addMonths = (base: MonthYear, offset: number): MonthYear => {
	const totalMonths = base.year * 12 + base.month + offset;
	return {
		year: Math.floor(totalMonths / 12),
		month: totalMonths % 12,
		id: generateMonthId(Math.floor(totalMonths / 12), totalMonths % 12),
	};
};

const generateMonthsRange = (
	center: MonthYear,
	before: number,
	after: number,
): MonthYear[] => {
	const months: MonthYear[] = [];
	for (let i = -before; i <= after; i++) {
		months.push(addMonths(center, i));
	}
	return months;
};

function Carousel() {
	const currentMonth = useMemo(
		() => ({
			year: new Date().getFullYear(),
			month: new Date().getMonth(),
			id: generateMonthId(
				new Date().getFullYear(),
				new Date().getMonth(),
			),
		}),
		[],
	);

	const [months, setMonths] = useState<MonthYear[]>(() =>
		generateMonthsRange(
			currentMonth,
			INITIAL_MONTHS_COUNT / 2,
			INITIAL_MONTHS_COUNT / 2,
		),
	);

	const listRef = useRef<FlatList>(null);

	const onViewableItemsChanged = useCallback(
		({ viewableItems }: { viewableItems: ViewToken[] }) => {
			if (viewableItems.length === 0) return;

			const firstVisible = viewableItems[0].index ?? 0;
			const lastVisible =
				viewableItems[viewableItems.length - 1].index ?? 0;

			// Charger plus au début
			if (firstVisible < LOAD_MORE_THRESHOLD) {
				setMonths((prev) => {
					const firstMonth = prev[0];
					const newMonths = generateMonthsRange(
						firstMonth,
						12,
						0,
					).slice(0, -1);
					return [...newMonths, ...prev];
				});
			}

			// Charger plus à la fin
			if (lastVisible > months.length - LOAD_MORE_THRESHOLD) {
				setMonths((prev) => {
					const lastMonth = prev[prev.length - 1];
					const newMonths = generateMonthsRange(
						lastMonth,
						0,
						12,
					).slice(1);
					return [...prev, ...newMonths];
				});
			}
		},
		[months.length],
	);

	const viewabilityConfig = useRef({
		itemVisiblePercentThreshold: 50,
	}).current;

	return (
		<FlatList
			ref={listRef}
			data={months}
			horizontal={true}
			renderItem={({ item }) => (
				<ThemedText>
					{new Date(item.year, item.month).toLocaleDateString(
						"fr-FR",
						{
							month: "long",
							year: "numeric",
						},
					)}
				</ThemedText>
			)}
			keyExtractor={(item) => item.id}
			initialScrollIndex={INITIAL_MONTHS_COUNT / 2}
			getItemLayout={(data, index) => ({
				length: 50,
				offset: 50 * index,
				index,
			})}
			onViewableItemsChanged={onViewableItemsChanged}
			viewabilityConfig={viewabilityConfig}
			maintainVisibleContentPosition={{
				minIndexForVisible: 0,
			}}
		/>
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

export default Carousel;
