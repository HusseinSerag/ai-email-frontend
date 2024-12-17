import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

export class MySocket {
  private constructor(token: string) {
    MySocket.socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
      auth: {
        token,
      },
    })
  }

  private static socket: Socket
  private static instance: MySocket | null = null

  static getSocket(token: string) {
    if (!MySocket.instance) {
      MySocket.instance = new MySocket(token)
    }
    return MySocket.instance
  }

  addListener(event: string, listener: (...args: any[]) => void) {
    if (MySocket.socket) {
      MySocket.socket.on(event, listener)
    }
  }

  emit(event: string, ...args: any[]): void {
    MySocket.socket.emit(event, ...args)
  }

  getSocket() {
    return MySocket.socket
  }
}
