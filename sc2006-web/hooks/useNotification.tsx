import { useContext } from 'react';
import { NotificationContext } from '../contexts';

export const useNotification = () => useContext(NotificationContext);
