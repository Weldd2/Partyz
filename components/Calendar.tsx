import useThemeColors from "@/hooks/useThemeColors";
import { PartyInterface } from "@/types/PartyInterface";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import ThemedText from "./Theme/ThemedText";

interface CalendarProps {
	party: PartyInterface;
}

export default function CalendarComponent({ party }: CalendarProps) {
	const colors = useThemeColors();
	const partyDate = new Date(party.date);

	// Get the current month and year from the party date
	const currentMonth = partyDate.getMonth();
	const currentYear = partyDate.getFullYear();

	// Get the first day of the month and total days
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
	const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
	const daysInMonth = lastDayOfMonth.getDate();
	const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

	// Adjust to Monday as first day of week (French convention)
	const adjustedStartingDay =
		startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

	// Month name in French
	const monthName = partyDate.toLocaleDateString("fr-FR", {
		month: "long",
		year: "numeric",
	});

	// Days of the week (French, starting with Monday)
	const daysOfWeek = ["L", "M", "M", "J", "V", "S", "D"];

	// Create calendar grid
	const calendarDays = useMemo(() => {
		const days = [];
		// Add empty cells for days before the first day of the month
		for (let i = 0; i < adjustedStartingDay; i++) {
			days.push(null);
		}
		// Add the days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(day);
		}
		return days;
	}, [adjustedStartingDay, daysInMonth]);

	// Check if a day has an event (in this case, the party date)
	const hasEvent = (day: number | null) => {
		if (!day) return false;
		return day === partyDate.getDate();
	};

	const isToday = (day: number | null) => {
		if (!day) return false;
		const today = new Date();
		return (
			day === today.getDate() &&
			currentMonth === today.getMonth() &&
			currentYear === today.getFullYear()
		);
	};

	return (
		<View
			style={{
				backgroundColor: colors.white,
				borderRadius: 12,
				padding: 20,
			}}
		>
			{/* Month header */}
			<ThemedText
				variant="h3"
				color="primary"
				style={{
					textAlign: "center",
					marginBottom: 20,
					textTransform: "capitalize",
				}}
			>
				{monthName}
			</ThemedText>

			{/* Days of week header */}
			<View
				style={{
					flexDirection: "row",
					marginBottom: 10,
				}}
			>
				{daysOfWeek.map((day, index) => (
					<View
						key={index}
						style={{
							flex: 1,
							alignItems: "center",
						}}
					>
						<ThemedText
							style={{
								fontSize: 12,
								color: colors.paragraphDisabled,
							}}
						>
							{day}
						</ThemedText>
					</View>
				))}
			</View>

			{/* Calendar grid */}
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
				}}
			>
				{calendarDays.map((day, index) => {
					const hasEventDot = hasEvent(day);
					const isTodayDate = isToday(day);

					return (
						<View
							key={index}
							style={{
								width: `${100 / 7}%`,
								aspectRatio: 1,
								padding: 4,
							}}
						>
							{day ? (
								<TouchableOpacity
									style={{
										flex: 1,
										justifyContent: "center",
										alignItems: "center",
										borderRadius: 8,
										backgroundColor: isTodayDate
											? colors.primary + "20"
											: "transparent",
									}}
									disabled={!hasEventDot}
								>
									<ThemedText
										style={{
											fontSize: 14,
											fontFamily: hasEventDot
												? "HossRound-Bold"
												: "HossRound",
											color: isTodayDate
												? colors.primary
												: colors.paragraph,
										}}
									>
										{day}
									</ThemedText>
									{hasEventDot && (
										<View
											style={{
												width: 6,
												height: 6,
												borderRadius: 3,
												backgroundColor:
													colors.secondary,
												marginTop: 2,
											}}
										/>
									)}
								</TouchableOpacity>
							) : (
								<View style={{ flex: 1 }} />
							)}
						</View>
					);
				})}
			</View>

			{/* Party info below calendar */}
			<View
				style={{
					marginTop: 20,
					paddingTop: 20,
					borderTopWidth: 1,
					borderTopColor: colors.paragraphDisabled + "30",
					gap: 8,
				}}
			>
				<ThemedText
					variant="h3"
					style={{ fontSize: 16, textAlign: "center" }}
				>
					{party.title}
				</ThemedText>
				<ThemedText
					style={{
						fontSize: 14,
						color: colors.paragraph,
						textAlign: "center",
					}}
				>
					{partyDate.toLocaleDateString("fr-FR", {
						weekday: "long",
						day: "numeric",
						month: "long",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</ThemedText>
				<ThemedText
					style={{
						fontSize: 12,
						color: colors.paragraphDisabled,
						textAlign: "center",
					}}
				>
					{party.address}
				</ThemedText>
			</View>
		</View>
	);
}
