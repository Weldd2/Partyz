import DateSlider from "@/components/DateSlider";
import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";

import PartyCard from "@/components/PartyCard";
import partiesFixture from "@/fixtures/parties";
import { useRouter } from "expo-router";

export default function Parties() {
	const [selectedDate, setSelectedDate] = useState<{
		month: string;
		year: string;
	} | null>(null);
	const router = useRouter();

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
		</>
	);
}
