import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  useTheme,
  HStack,
  VStack,
  Text,
  ScrollView,
  Box,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';
import firestore from '@react-native-firebase/firestore';

import { Loading } from '../components/Loading';
import { Header } from '../components/Header';  
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { firestoreDateFormat } from '../utils/firestoreDateFormat';

import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import type { OrderProps } from '../components/Order';

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed?: string;
}

const Details = () => {
  const { goBack } = useNavigation();
  const { colors } = useTheme();
  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [orderCloseLoading, setOrderCloseLoading] = useState(false);
  const [order, setOrder] = useState({} as OrderDetails);

  const handleOrderClose = () => {
    if (!solution) {
      return Alert.alert("Solicitação", "Informe a solução para encerrar a solicitação");
    }

    setOrderCloseLoading(true);

    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      Alert.alert("Solicitação", "Informe a solução para encerrar a solicitação");
      goBack();
    })
    .catch(error => {
      console.log(error);
      Alert.alert("Solicitação", "Não foi possível encerrar a solicitação");
    });
  };

  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then(doc => {
      const {
        patrimony,
        description,
        status,
        created_at,
        solution,
        closed_at
      } = doc.data();

      const closed = closed_at ? firestoreDateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        when: firestoreDateFormat(created_at),
        solution,
        closed,
      });

      setIsLoading(false);
    })
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed' ?
          <CircleWavyCheck size={22} color={colors.green[300]} /> :
          <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />
        
        <CardDetails
          title="descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />
        
        <CardDetails
          title="solução"
          description={order.solution}
          icon={CircleWavyCheck}
          footer={!!order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === 'open' && (
            <Input
              h={24}
              multiline
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              textAlignVertical="top"
            />
          )}
        </CardDetails>
      </ScrollView>

      {order.status === 'open' && (
        <Button
          m={5}
          title="Encerrar solicitação"
          onPress={handleOrderClose}
          isLoading={orderCloseLoading}
        />
      )}
    </VStack>
  );
};

export { Details };