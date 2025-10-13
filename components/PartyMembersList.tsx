import ThemedText from "@/components/Theme/ThemedText";
import useThemeColors from "@/hooks/useThemeColors";
import { UserInterface } from "@/types/UserInterface";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import { memo, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface PartyMembersListProps {
	members: Array<UserInterface>;
	owner: UserInterface;
}

const PartyMembersList = memo(function PartyMembersList({
	members,
	owner,
}: PartyMembersListProps) {
	const colors = useThemeColors();
	const styles = useMemo(() => getStyles(colors), [colors]);

	const renderMember = ({ item }: { item: UserInterface }) => {
		const isOwner = item.id === owner.id;

		return (
			<View style={styles.memberItem}>
				<View style={styles.avatarContainer}>
					<Image
						source={`https://i.pravatar.cc/150?u=${item.id}`}
						style={styles.avatar}
						contentFit="cover"
					/>
					{isOwner && (
						<View style={styles.ownerBadge}>
							<FontAwesome6
								name="crown"
								size={10}
								color={colors.primary}
							/>
						</View>
					)}
				</View>
				<ThemedText style={styles.memberName}>
					{item.firstname} {item.lastname}
				</ThemedText>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={members}
				renderItem={renderMember}
				keyExtractor={(item) => item.id.toString()}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.listContent}
				removeClippedSubviews={true}
				maxToRenderPerBatch={10}
				windowSize={10}
			/>
		</View>
	);
});

const getStyles = (colors: ReturnType<typeof useThemeColors>) =>
	StyleSheet.create({
		container: {
			marginVertical: 10,
		},
		listContent: {
			gap: 15,
			paddingHorizontal: 5,
		},
		memberItem: {
			alignItems: "center",
			gap: 8,
			width: 80,
		},
		avatarContainer: {
			position: "relative",
		},
		avatar: {
			width: 60,
			height: 60,
			borderRadius: 30,
			borderWidth: 2,
			borderColor: colors.secondary,
		},
		ownerBadge: {
			position: "absolute",
			bottom: 0,
			right: 0,
			backgroundColor: colors.third,
			borderRadius: 10,
			width: 20,
			height: 20,
			justifyContent: "center",
			alignItems: "center",
			borderWidth: 2,
			borderColor: colors.background,
		},
		memberName: {
			fontSize: 12,
			fontWeight: "600",
			textAlign: "center",
		},
	});

export default PartyMembersList;
