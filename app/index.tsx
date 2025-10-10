import DateSlider from "@/components/DateSlider";
import PartyCard from "@/components/PartyCard";
import partiesFixture from "@/fixtures/parties";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

export default function Parties() {
	const [selectedDate, setSelectedDate] = useState<{
		month: string;
		year: string;
	} | null>(null);
	const router = useRouter();
	const colors = useThemeColors();

	const styles = StyleSheet.create({
		fabContainer: {
			position: "absolute",
			bottom: 20,
			right: 20,
			zIndex: 1000,
		},
		fab: {
			width: 60,
			height: 60,
			borderRadius: 30,
			backgroundColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
			shadowColor: colors.primary,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.3,
			shadowRadius: 8,
			elevation: 8,
		},
	});

	return (
		<>
			<DateSlider onDateChange={setSelectedDate} />
			<FlatList
				data={partiesFixture.member}
				renderItem={({ item }) => {
					return (
						<Pressable
							onPress={() =>
								router.push(`/party/${item.id}/details`)
							}
						>
							<PartyCard party={item} />
						</Pressable>
					);
				}}
				style={{ padding: 10 }}
				ItemSeparatorComponent={() => {
					return <View style={{ height: 40 }}></View>;
				}}
				keyExtractor={(item) => item.id}
				removeClippedSubviews={true}
				maxToRenderPerBatch={10}
				windowSize={10}
			/>
			{/* Floating Action Button */}
			<View style={styles.fabContainer}>
				<Pressable
					style={({ pressed }) => [
						styles.fab,
						{ opacity: pressed ? 0.8 : 1 },
					]}
					onPress={() => router.push("/party/create")}
				>
					<FontAwesome6 name="plus" size={24} color={colors.white} />
				</Pressable>
			</View>
		</>
	);
}
