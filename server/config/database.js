import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

if (!GAS_URL) {
  console.warn('WARNING: GOOGLE_APPS_SCRIPT_URL is not set in .env file');
}

async function callGAS(action, data = {}) {
  if (!GAS_URL) {
    throw new Error('Google Apps Script URL not configured');
  }

  try {
    const response = await axios.post(GAS_URL, { action, ...data });
    return response.data;
  } catch (error) {
    console.error('GAS call error:', error.response?.data || error.message);
    throw error;
  }
}

export const database = {
  async savePost(post) {
    return callGAS('savePost', { post });
  },

  async getPosts(status = null) {
    return callGAS('getPosts', { status });
  },

  async updatePost(postId, updates) {
    return callGAS('updatePost', { postId, updates });
  },

  async saveAuth(auth) {
    return callGAS('saveAuth', { auth });
  },

  async getAuth() {
    return callGAS('getAuth');
  },

  async getLogs() {
    return callGAS('getLogs');
  },

  async saveLog(log) {
    return callGAS('saveLog', { log });
  },

  async getStats() {
    return callGAS('getStats');
  },
};
