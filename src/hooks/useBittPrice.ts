import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface BittPrice {
  symbol: string;
  price: number;
  timestamp: string;
}

export const useBittPrice = () => {
  const [price, setPrice] = useState<BittPrice | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/bitt-price`, { transports: ['websocket'] });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribe-price');
    });

    socket.on('bitt-price-update', (data: BittPrice) => {
      setPrice(data);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.close();
    };
  }, []);

  return { price, isConnected };
};
