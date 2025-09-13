import ThemedMessageInput from "@/components/Theme/Input/ThemedMessageInput";
import ThemedText from "@/components/Theme/ThemedText";
import { Colors } from "@/constants/colors";
import partiesFixture from "@/fixtures/parties";
import useApi from "@/hooks/useApi";
import useThemeColors from "@/hooks/useThemeColors";
import { PartyInterface } from "@/types/PartyInterface";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	Alert,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from "react-native";

type Message = {
	id: string;
	text: string;
	senderId: string;
	senderName: string;
	timestamp: Date;
	isOwn: boolean;
};

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		messageContainer: {
			paddingHorizontal: 10,
			paddingVertical: 5,
		},
		messageBubble: {
			maxWidth: "75%",
			borderRadius: 16,
			paddingHorizontal: 14,
			paddingVertical: 10,
			borderWidth: 1,
		},
		ownMessage: {
			alignSelf: "flex-end",
			backgroundColor: colors.primary,
			borderColor: colors.primary,
		},
		otherMessage: {
			alignSelf: "flex-start",
			backgroundColor: colors.white,
			borderColor: colors.primary,
		},
		messageText: {
			fontSize: 16,
		},
		ownMessageText: {
			color: colors.white,
		},
		otherMessageText: {
			color: colors.paragraph,
		},
		senderName: {
			fontSize: 12,
			marginBottom: 2,
			fontFamily: "HossRound-Bold",
		},
		timestamp: {
			fontSize: 11,
			marginTop: 4,
			opacity: 0.7,
		},
		emptyState: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			paddingHorizontal: 40,
		},
	});

export default function Chat() {
	const colors = useThemeColors();
	const styles = useMemo(() => getStyles(colors), [colors]);
	const { id } = useLocalSearchParams();
	const flatListRef = useRef<FlatList<Message>>(null);

	const {
		isLoading,
		error,
		data: party,
	} = useApi<PartyInterface>("party", `/parties/${id}`);

	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			text: "Salut tout le monde ! Vous êtes prêts pour la soirée ?",
			senderId: "1",
			senderName: "Marie",
			timestamp: new Date(Date.now() - 3600000),
			isOwn: false,
		},
		{
			id: "2",
			text: "Oui j'ai trop hâte ! Je ramène des boissons 🍹",
			senderId: "2",
			senderName: "Toi",
			timestamp: new Date(Date.now() - 1800000),
			isOwn: true,
		},
		{
			id: "3",
			text: "Super ! N'oubliez pas que c'est à 20h précises. J'ai préparé plein de surprises 🎉",
			senderId: "1",
			senderName: "Marie",
			timestamp: new Date(Date.now() - 900000),
			isOwn: false,
		},
	]);

	const handleSendMessage = useCallback((text: string) => {
		const newMessage: Message = {
			id: Date.now().toString(),
			text,
			senderId: "2",
			senderName: "Toi",
			timestamp: new Date(),
			isOwn: true,
		};
		setMessages((prev) => [...prev, newMessage]);
		// Scroll is now handled by onContentSizeChange
	}, []);

	const handleAttach = useCallback(() => {
		Alert.alert(
			"Ajouter une pièce jointe",
			"Fonctionnalité à venir : sélection de photos et fichiers",
		);
	}, []);

	const handleInputFocus = useCallback(() => {
		// Delay scroll to allow keyboard animation to start
		setTimeout(() => {
			flatListRef.current?.scrollToEnd({ animated: true });
		}, 150);
	}, []);

	const handleContentSizeChange = useCallback(() => {
		// Auto-scroll when content size changes (new messages)
		flatListRef.current?.scrollToEnd({ animated: true });
	}, []);

	const handleLayout = useCallback(() => {
		// Auto-scroll when layout changes (keyboard appears/disappears)
		flatListRef.current?.scrollToEnd({ animated: false });
	}, []);

	const renderMessage = useCallback(
		({ item }: { item: Message }) => {
			const formattedTime = item.timestamp.toLocaleTimeString("fr-FR", {
				hour: "2-digit",
				minute: "2-digit",
			});

			return (
				<View style={styles.messageContainer}>
					<View
						style={[
							styles.messageBubble,
							item.isOwn
								? styles.ownMessage
								: styles.otherMessage,
						]}
					>
						{!item.isOwn && (
							<ThemedText
								style={[
									styles.senderName,
									{ color: colors.primary },
								]}
							>
								{item.senderName}
							</ThemedText>
						)}
						<ThemedText
							style={[
								styles.messageText,
								item.isOwn
									? styles.ownMessageText
									: styles.otherMessageText,
							]}
						>
							{item.text}
						</ThemedText>
						<ThemedText
							style={[
								styles.timestamp,
								{
									color: item.isOwn
										? colors.white
										: colors.paragraphDisabled,
								},
							]}
						>
							{formattedTime}
						</ThemedText>
					</View>
				</View>
			);
		},
		[styles, colors],
	);

	if (isLoading) {
		return <ThemedText>Is loading...</ThemedText>;
	}

	if (error || !party) {
		console.error(error);
		return <ThemedText>error</ThemedText>;
	}

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
		>
			{messages.length === 0 ? (
				<View style={styles.emptyState}>
					<ThemedText
						style={{
							textAlign: "center",
							color: colors.paragraphDisabled,
							fontSize: 16,
						}}
					>
						Aucun message pour le moment.{"\n"}
						Soyez le premier à écrire !
					</ThemedText>
				</View>
			) : (
				<FlatList
					ref={flatListRef}
					data={messages}
					renderItem={renderMessage}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingVertical: 10 }}
					inverted={false}
					removeClippedSubviews={true}
					maxToRenderPerBatch={15}
					windowSize={10}
					onContentSizeChange={handleContentSizeChange}
					onLayout={handleLayout}
				/>
			)}

			<ThemedMessageInput
				onSendMessage={handleSendMessage}
				onAttachPress={handleAttach}
				onFocus={handleInputFocus}
				placeholder="Écrivez un message..."
			/>
		</KeyboardAvoidingView>
	);
}
