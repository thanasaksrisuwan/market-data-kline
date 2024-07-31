export default class WebSocketService {
    constructor(url, onMessage) {
      this.url = url;
      this.onMessage = onMessage;
      this.ws = null;
      this.reconnectInterval = 5000;
    }
  
    connect() {
      this.ws = new WebSocket(this.url);
  
      this.ws.onopen = () => {
        console.log('WebSocket connected');
      };
  
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error(error);
        }
      };
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      // TODO:: heart beat ping pong
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.reason);
        setTimeout(() => this.connect(), this.reconnectInterval);
      };
    }
  
    disconnect() {
      if (this.ws) {
        this.ws.close();
      }
    }
  
    isConnected() {
      return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
  }
  