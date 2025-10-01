const SHEET_NAME = 'LinkedIn Posts';
const AUTH_SHEET_NAME = 'LinkedIn Auth';
const LOGS_SHEET_NAME = 'Activity Logs';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case 'savePost':
        return savePost(data);
      case 'getPosts':
        return getPosts(data);
      case 'updatePost':
        return updatePost(data);
      case 'saveAuth':
        return saveAuth(data);
      case 'getAuth':
        return getAuth();
      case 'getLogs':
        return getLogs();
      case 'saveLog':
        return saveLog(data);
      case 'getStats':
        return getStats();
      default:
        return createResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    return createResponse({ success: false, error: error.toString() });
  }
}

function doGet(e) {
  return createResponse({
    status: 'active',
    message: 'LinkedIn Posts Manager API is running',
  });
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function savePost(data) {
  const sheet = getOrCreateSheet(SHEET_NAME);
  const post = data.post;

  const row = [
    post.id || Utilities.getUuid(),
    post.niche,
    post.content,
    post.status || 'generated',
    post.generated_at || new Date().toISOString(),
    post.approved_at || '',
    post.posted_at || '',
    post.linkedin_post_id || '',
    new Date().toISOString(),
  ];

  sheet.appendRow(row);

  saveLog({
    log: {
      post_id: row[0],
      action: 'generated',
      details: JSON.stringify({ niche: post.niche }),
    },
  });

  return createResponse({
    success: true,
    post: {
      id: row[0],
      niche: row[1],
      content: row[2],
      status: row[3],
      generated_at: row[4],
      approved_at: row[5],
      posted_at: row[6],
      linkedin_post_id: row[7],
      created_at: row[8],
    },
  });
}

function getPosts(data) {
  const sheet = getOrCreateSheet(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return createResponse({ success: true, posts: [] });
  }

  const posts = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[0]) {
      const post = {
        id: row[0],
        niche: row[1],
        content: row[2],
        status: row[3],
        generated_at: row[4],
        approved_at: row[5],
        posted_at: row[6],
        linkedin_post_id: row[7],
        created_at: row[8],
      };

      if (data.status && post.status !== data.status) {
        continue;
      }

      posts.push(post);
    }
  }

  posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return createResponse({ success: true, posts });
}

function updatePost(data) {
  const sheet = getOrCreateSheet(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const postId = data.postId;
  const updates = data.updates;

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === postId) {
      if (updates.status !== undefined) sheet.getRange(i + 1, 4).setValue(updates.status);
      if (updates.approved_at !== undefined)
        sheet.getRange(i + 1, 6).setValue(updates.approved_at);
      if (updates.posted_at !== undefined)
        sheet.getRange(i + 1, 7).setValue(updates.posted_at);
      if (updates.linkedin_post_id !== undefined)
        sheet.getRange(i + 1, 8).setValue(updates.linkedin_post_id);

      saveLog({
        log: {
          post_id: postId,
          action: updates.status || 'updated',
          details: JSON.stringify(updates),
        },
      });

      const updatedPost = {
        id: values[i][0],
        niche: values[i][1],
        content: values[i][2],
        status: updates.status || values[i][3],
        generated_at: values[i][4],
        approved_at: updates.approved_at || values[i][5],
        posted_at: updates.posted_at || values[i][6],
        linkedin_post_id: updates.linkedin_post_id || values[i][7],
        created_at: values[i][8],
      };

      return createResponse({ success: true, post: updatedPost });
    }
  }

  return createResponse({ success: false, error: 'Post not found' });
}

function saveAuth(data) {
  const sheet = getOrCreateSheet(AUTH_SHEET_NAME);
  const auth = data.auth;

  const existingData = sheet.getDataRange().getValues();
  if (existingData.length > 1) {
    sheet.getRange(2, 1).setValue(auth.access_token);
    sheet.getRange(2, 2).setValue(auth.refresh_token || '');
    sheet.getRange(2, 3).setValue(auth.expires_at || '');
    sheet.getRange(2, 4).setValue(auth.linkedin_user_id || '');
    sheet.getRange(2, 5).setValue(auth.user_name || '');
    sheet.getRange(2, 6).setValue(new Date().toISOString());
  } else {
    sheet.appendRow([
      auth.access_token,
      auth.refresh_token || '',
      auth.expires_at || '',
      auth.linkedin_user_id || '',
      auth.user_name || '',
      new Date().toISOString(),
    ]);
  }

  return createResponse({ success: true });
}

function getAuth() {
  const sheet = getOrCreateSheet(AUTH_SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return createResponse({ success: true, auth: null });
  }

  const row = values[1];
  const auth = {
    access_token: row[0],
    refresh_token: row[1],
    expires_at: row[2],
    linkedin_user_id: row[3],
    user_name: row[4],
    updated_at: row[5],
  };

  const isExpired = auth.expires_at && new Date(auth.expires_at) < new Date();

  return createResponse({
    success: true,
    auth: isExpired ? null : auth,
  });
}

function saveLog(data) {
  const sheet = getOrCreateSheet(LOGS_SHEET_NAME);
  const log = data.log;

  sheet.appendRow([
    Utilities.getUuid(),
    log.post_id,
    log.action,
    log.details || '{}',
    new Date().toISOString(),
  ]);

  return createResponse({ success: true });
}

function getLogs() {
  const sheet = getOrCreateSheet(LOGS_SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return createResponse({ success: true, logs: [] });
  }

  const logs = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[0]) {
      logs.push({
        id: row[0],
        post_id: row[1],
        action: row[2],
        details: row[3],
        created_at: row[4],
      });
    }
  }

  logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return createResponse({ success: true, logs: logs.slice(0, 50) });
}

function getStats() {
  const sheet = getOrCreateSheet(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  const stats = {
    total: 0,
    generated: 0,
    approved: 0,
    posted: 0,
    rejected: 0,
  };

  for (let i = 1; i < values.length; i++) {
    if (values[i][0]) {
      stats.total++;
      const status = values[i][3];
      if (stats[status] !== undefined) {
        stats[status]++;
      }
    }
  }

  return createResponse({ success: true, stats });
}

function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    if (sheetName === SHEET_NAME) {
      const headers = [
        'ID',
        'Niche',
        'Content',
        'Status',
        'Generated At',
        'Approved At',
        'Posted At',
        'LinkedIn Post ID',
        'Created At',
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#4CAF50');
      sheet.getRange(1, 1, 1, headers.length).setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    } else if (sheetName === AUTH_SHEET_NAME) {
      const headers = [
        'Access Token',
        'Refresh Token',
        'Expires At',
        'LinkedIn User ID',
        'User Name',
        'Updated At',
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#2196F3');
      sheet.getRange(1, 1, 1, headers.length).setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    } else if (sheetName === LOGS_SHEET_NAME) {
      const headers = ['ID', 'Post ID', 'Action', 'Details', 'Created At'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#FF9800');
      sheet.getRange(1, 1, 1, headers.length).setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }
  }

  return sheet;
}

function setupAllSheets() {
  getOrCreateSheet(SHEET_NAME);
  getOrCreateSheet(AUTH_SHEET_NAME);
  getOrCreateSheet(LOGS_SHEET_NAME);
  SpreadsheetApp.getActiveSpreadsheet().toast('All sheets setup complete!', 'Success');
}
