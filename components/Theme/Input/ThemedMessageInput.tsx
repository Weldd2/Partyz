import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			flexDirection: "row",
			alignItems: "flex-end",
			paddingHorizontal: 10,
			paddingVertical: 8,
			backgroundColor: colors.white,
			borderTopWidth: 1,
			borderTopColor: colors.primary,
			gap: 8,
		},
		inputContainer: {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: colors.background,
			borderRadius: 24,
			borderWidth: 1,
			borderColor: colors.primary,
			paddingHorizontal: 12,
			paddingVertical: 6,
			minHeight: 44,
			maxHeight: 120,
		},
		input: {
			flex: 1,
			fontSize: 16,
			fontFamily: "HossRound",
			color: colors.paragraph,
			paddingVertical: 8,
			paddingHorizontal: 8,
			maxHeight: 100,
		},
		iconButton: {
			width: 32,
			height: 32,
			borderRadius: 16,
			justifyContent: "center",
			alignItems: "center",
		},
		attachButton: {
			marginRight: 4,
		},
		sendButton: {
			width: 44,
			height: 44,
			borderRadius: 22,
			backgroundColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
			shadowColor: colors.primary,
			shadowOffset: { width: 1, height: 1 },
			shadowOpacity: 0.3,
			shadowRadius: 2,
		},
		sendButtonDisabled: {
			backgroundColor: colors.paragraphDisabled,
			opacity: 0.5,
		},
		micButton: {
			width: 44,
			height: 44,
			borderRadius: 22,
			backgroundColor: colors.secondary,
			justifyContent: "center",
			alignItems: "center",
		},
	});

type Props = {
	onSendMessage?: (message: string) => void;
	onAttachPress?: () => void;
	placeholder?: string;
	maxLength?: number;
};

export default function ThemedMessageInput({
	onSendMessage,
	onAttachPress,
	placeholder = "Message...",
	maxLength = 1000,
}: Props) {
	const colors = useThemeColors();
	const styles = getStyles(colors);
	const [message, setMessage] = useState("");
	const [inputHeight, setInputHeight] = useState(44);

	const hasText = message.trim().length > 0;

	const handleSend = () => {
		if (hasText) {
			onSendMessage?.(message.trim());
			setMessage("");
			setInputHeight(44);
			Keyboard.dismiss();
		}
	};

	const handleContentSizeChange = (e: any) => {
		const height = e.nativeEvent.contentSize.height;
		setInputHeight(Math.min(Math.max(44, height + 16), 120));
	};

	return (
		<View style={styles.container}>
			<View style={[styles.inputContainer, { minHeight: inputHeight }]}>
				{/* Bouton d'attachement */}
				<Pressable
					onPress={onAttachPress}
					style={[styles.iconButton, styles.attachButton]}
				>
					{({ pressed }) => (
						<FontAwesome
							name="plus-circle"
							size={24}
							color={colors.primary}
							style={{ opacity: pressed ? 0.6 : 1 }}
						/>
					)}
				</Pressable>

				{/* Input de texte */}
				<TextInput
					style={styles.input}
					value={message}
					onChangeText={setMessage}
					placeholder={placeholder}
					placeholderTextColor={colors.paragraphDisabled}
					multiline
					maxLength={maxLength}
					onContentSizeChange={handleContentSizeChange}
					textAlignVertical="center"
					returnKeyType="default"
					blurOnSubmit={false}
				/>
			</View>

			<Pressable
				onPress={handleSend}
				style={({ pressed }) => [
					styles.sendButton,
					{ opacity: pressed ? 0.8 : 1 },
				]}
			>
				<FontAwesome name="send" size={18} color={colors.white} />
			</Pressable>
		</View>
	);
}
