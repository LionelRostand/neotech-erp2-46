
/**
 * Simple Event Emitter pour les communications entre composants.
 */
export class EventEmitter {
  private events: Record<string, Array<(...args: any[]) => void>> = {};

  /**
   * Subscribe to an event
   * @param event Event name
   * @param callback Callback function
   * @returns Unsubscribe function
   */
  on(event: string, callback: (...args: any[]) => void): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  /**
   * Emit an event with arguments
   * @param event Event name
   * @param args Arguments to pass to callbacks
   */
  emit(event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback(...args);
      });
    }
  }
  
  /**
   * Remove all listeners for an event
   * @param event Event name
   */
  removeAllListeners(event?: string): void {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}
