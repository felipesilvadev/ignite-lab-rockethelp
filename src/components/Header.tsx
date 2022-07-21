import { Heading, HStack, IconButton, StyledProps, useTheme } from "native-base";
import { CaretLeft } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";

type Props = StyledProps & {
  title: string;
}

const Header = ({ title, ...rest }: Props) => {
  const { colors } = useTheme();
  const { goBack } = useNavigation();

  const handleGoBack = () => goBack();

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.600"
      pb={6}
      pt={12}
      {...rest}
    >
      <IconButton
        icon={<CaretLeft size={24} color={colors.gray[200]} />}
        onPress={handleGoBack}
      />

      <Heading
        flex={1}
        color="gray.100"
        textAlign="center"
        fontSize="lg"
        pl={-6}
        >
          {title}
      </Heading>
    </HStack>
  );
};

export { Header };