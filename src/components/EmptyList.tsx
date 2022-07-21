import { Center, Text, useTheme } from "native-base";
import { ChatTeardropText } from "phosphor-react-native";

type Props = {
  description: string;
}

const EmptyList = ({ description }: Props) => {
  const { colors } = useTheme();

  return (
    <Center>
      <ChatTeardropText size={40} color={colors.gray[300]} />
      <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
        Você ainda não possui {'\n'}
        solicitações {description}
      </Text>
    </Center>
  );
};

export { EmptyList };