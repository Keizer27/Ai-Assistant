const fs = require('fs');
const cron = require('node-cron');
const axios = require('axios');
const path = require('path');

const KEY_FILE = path.join(__dirname, 'keys.json');

class KeyManager {
  constructor() {
    this.keys = [];
    this.currentIndex = 0;
    this.usageCount = 0;
    this.loadKeys();
    this.startScheduler();
  }

  loadKeys() {
    const { keys, currentIndex } = JSON.parse(fs.readFileSync(KEY_FILE));
    this.keys = keys;
    this.currentIndex = currentIndex;
  }

  saveState() {
    fs.writeFileSync(KEY_FILE, JSON.stringify({
      keys: this.keys,
      currentIndex: this.currentIndex
    }, null, 2));
  }

  async rotateKey() {
    const originalIndex = this.currentIndex;
    let attempts = 0;
    
    while (attempts < this.keys.length) {
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      attempts++;
      
      if (await this.testKey(this.keys[this.currentIndex])) {
        this.saveState();
        this.usageCount = 0;
        console.log(`Rotated to key index ${this.currentIndex}`);
        return;
      }
    }
    
    throw new Error('All keys failed health check');
  }

  async testKey(key) {
    try {
      await axios.get('https://openrouter.ai/api/v1/auth/key', {
        headers: { Authorization: `Bearer ${key}` },
        timeout: 3000
      });
      return true;
    } catch {
      return false;
    }
  }

  startScheduler() {
    cron.schedule('0 0 */3 * *', () => this.rotateKey());
  }

  trackUsage() {
    if (++this.usageCount > 950) {
      this.rotateKey();
    }
  }

  getCurrentKey() {
    return this.keys[this.currentIndex];
  }
}

module.exports = new KeyManager();
