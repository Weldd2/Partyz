import DateSlider from "@/components/DateSlider";
import PartyCard from "@/components/PartyCard";
import useApi from "@/hooks/useApi";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, View, Text } from "react-native";
import type { PartyInterface } from "@/types/PartyInterface";
import { ApiCollectionInterface } from "@/types/ApiInterface";

export default function Parties() {
	const [selectedDate, setSelectedDate] = useState<{
		month: string;
		year: string;
	} | null>(null);
	const router = useRouter();
	const colors = useThemeColors();
	const {
		isLoading,
		error,
		data: parties,
	} = useApi<ApiCollectionInterface<PartyInterface>>("party", "/parties");

	const styles = StyleSheet.create({
		container: {
			flexGrow: 1,
		},
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

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	if (error || !parties) {
		console.log(error);
		return <Text>Error</Text>;
	}

	return (
		<View style={styles.container}>
			<DateSlider onDateChange={setSelectedDate} />
			<FlatList
				data={parties.member}
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
				style={{ padding: 10, height: "100%" }}
				ItemSeparatorComponent={() => {
					return <View style={{ height: 40 }}></View>;
				}}
				ListEmptyComponent={
					<View>
						<Text>rien du tout</Text>
					</View>
				}
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
		</View>
	);
}
