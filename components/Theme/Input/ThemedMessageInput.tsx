import { Colors } from "@/constants/colors";
import useThemeColors from "@/hooks/useThemeColors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";

const getStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		container: {
			flexDirection: "row",
			alignItems: "flex-end",
			paddingHorizontal: 10,
		},
		inputContainer: {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: colors.white,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: colors.primary,
			paddingHorizontal: 16,
			maxHeight: 120,
		},
		input: {
			flex: 1,
			fontSize: 14,
			fontFamily: "HossRound",
			color: colors.paragraph,
			maxHeight: 100,
		},
		sendButton: {
			padding: 5,
		},
		sendButtonDisabled: {
			backgroundColor: colors.paragraphDisabled,
			opacity: 0.5,
		},
	});

type Props = {
	onSendMessage?: (message: string) => void;
	onAttachPress?: () => void;
	onFocus?: () => void;
	placeholder?: string;
	maxLength?: number;
};

export default function ThemedMessageInput({
	onSendMessage,
	onAttachPress,
	onFocus,
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
				<TextInput
					style={styles.input}
					value={message}
					onChangeText={setMessage}
					onFocus={onFocus}
					placeholder={placeholder}
					placeholderTextColor={colors.paragraphDisabled}
					multiline
					maxLength={maxLength}
					onContentSizeChange={handleContentSizeChange}
					textAlignVertical="center"
					returnKeyType="default"
					blurOnSubmit={false}
				/>

				<Pressable
					onPress={handleSend}
					style={({ pressed }) => [
						styles.sendButton,
						{ opacity: pressed ? 0.8 : 1 },
					]}
				>
					<FontAwesome6 name="location-arrow" size={18} color={colors.primary} />
				</Pressable>
			</View>
		</View>
	);
}
