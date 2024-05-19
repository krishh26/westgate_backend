import { socketEvent } from '../Util/contant';
import { getIo } from './socket';

interface UserSocketMap {
    [userId: string]: string[];
}

const userSocketMap: UserSocketMap = {};
export function connectUser(userId: string): void {
    const io = getIo();
    console.log('Connecting')
    io.on('connection', (socket) => {
        console.log(userId + ' connected')
        console.log('A user connected', socket.id, userId);

        userSocketMap[userId] = [...(userSocketMap[userId] ?? []), ...(userSocketMap[userId] && userSocketMap[userId].includes(socket.id) ? [] : [socket.id])];

        socket.on('disconnect', () => {
            console.log('socket disconnected')
            userSocketMap[userId].reduce((acc, curr: any) => curr !== socket.id ? acc.concat(curr) : acc, [])
            console.log('socket disconnected', userSocketMap)
        });
        console.log(userSocketMap, 'userSocketMap')
    });
    io.emit('connect_user', userId);
    console.log(userSocketMap, 'userSocketMap')
}

export function sendMessageToUser(userId: string, data: any): void {
    const io = getIo();
    if (userSocketMap[userId]) {
        io.to(userSocketMap[userId]).emit(socketEvent.Message, data);
    } else {
        console.error('User not connected');
    }
}

export function sendNotificationToUser(userId: string, data: any): void {
    const io = getIo();
    if (userSocketMap[userId]) {
        io.to(userSocketMap[userId]).emit(socketEvent.Notification, data);
    } else {
        console.error('User not connected');
    }
}