import React, { useState } from 'react';
import {
  useTheme,
  HStack,
  IconButton,
  VStack,
  Text,
  Heading,
  FlatList,
} from 'native-base';
import { SignOut } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import { Filter } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import { Button } from '../components/Button';
import { EmptyList } from '../components/EmptyList';

import Logo from '../assets/logo_secondary.svg';

const Home = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();

  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const [orders, setOrders] = useState<OrderProps[]>([
    {
      id: '123',
      patrimony: '90908080',
      when: '18/07/2022 às 10:00',
      status: 'open',
    },
    {
      id: '321',
      patrimony: '80809090',
      when: '21/07/2022 às 17:00',
      status: 'closed',
    },
  ]);

  const handleNewOrder = () => {
    navigate('new');
  };
  
  const handleOpenDetails = (orderId: string) => {
    navigate('details', { orderId });
  };

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton 
          icon={<SignOut size={26} color={colors.gray[300]} />}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
          <Heading color="gray.100">
            Solicitações
          </Heading>

          <Text color="gray.200">
            {orders.length}
          </Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="Em andamento"
            isActive={statusSelected === 'open'}
            onPress={() => setStatusSelected('open')}
          />
          <Filter
            type="closed"
            title="Finalizados"
            isActive={statusSelected === 'closed'}
            onPress={() => setStatusSelected('closed')}
          />
        </HStack>

        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Order data={item} onPress={() => handleOpenDetails(item.id)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListEmptyComponent={
            <EmptyList description={statusSelected === 'open' ? 'em andamento' : 'finalizadas'} />
          }
        />

        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
};

export { Home };