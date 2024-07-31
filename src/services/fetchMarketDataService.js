export default class WebSocketService {
    constructor(url, onMessage) {
        this.url = url;
        this.onMessage = onMessage;
        this.ws = null;
        this.reconnectInterval = 5000;
        this.heartbeatInterval = 30000;
        this.heartbeatTimer = null;
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

    // TODO:: heart beat ping pong
    // startHeartbeat() {
    //     if (this.heartbeatTimer) return; // Prevent multiple timers
    //     this.heartbeatTimer = setInterval(() => {
    //         if (this.isConnected()) {
    //             this.ws.send(JSON.stringify({ type: 'ping' }));
    //         }
    //     }, this.heartbeatInterval);
    // }

    // stopHeartbeat() {
    //     if (this.heartbeatTimer) {
    //         clearInterval(this.heartbeatTimer);
    //         this.heartbeatTimer = null;
    //     }
    // }
}
