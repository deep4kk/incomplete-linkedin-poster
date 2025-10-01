import axios from 'axios';
import { database } from '../config/database.js';

export async function getLinkedInAuthUrl() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI);
  const scope = encodeURIComponent('openid profile email w_member_social');
  const state = Math.random().toString(36).substring(7);

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

  return { authUrl, state };
}

export async function exchangeCodeForToken(code) {
  try {
    const response = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, expires_in } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    const userInfo = await getUserInfo(access_token);

    await database.saveAuth({
      access_token,
      expires_at: expiresAt.toISOString(),
      linkedin_user_id: userInfo.sub,
      user_name: userInfo.name,
    });

    return { accessToken: access_token, userInfo };
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error);
    throw new Error('Failed to authenticate with LinkedIn');
  }
}

export async function getUserInfo(accessToken) {
  try {
    const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw new Error('Failed to get user info');
  }
}

export async function getStoredAccessToken() {
  try {
    const result = await database.getAuth();

    if (result.success && result.auth) {
      return result.auth.access_token;
    }

    return null;
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
}

export async function postToLinkedIn(content, accessToken) {
  try {
    const token = accessToken || (await getStoredAccessToken());

    if (!token) {
      throw new Error('No valid access token found. Please authenticate first.');
    }

    const userInfo = await getUserInfo(token);
    const authorUrn = `urn:li:person:${userInfo.sub}`;

    const postData = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error posting to LinkedIn:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to post to LinkedIn');
  }
}
