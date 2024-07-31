export default class WebSocketService {
    constructor(url, onMessage) {
      this.url = url;
      this.onMessage = onMessage;
      this.ws = null;
      this.reconnectInterval = 5000; // Time to wait before attempting reconnection (in milliseconds)
    }
  
    connect() {
      this.ws = new WebSocket(this.url);
  
      this.ws.onopen = () => {
        console.log('WebSocket connection opened.');
      };
  
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('Failed to parse message data:', error);
        }
      };
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      this.ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.reason);
        // Optionally attempt to reconnect
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
  