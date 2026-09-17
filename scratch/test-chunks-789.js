const API_BASE = 'http://localhost:3000/api/v1';

async function runIntegrationTest() {
  console.log('🚀 Starting Integration Test for Chunks 7, 8, and 9 with native fetch...\n');
  const timestamp = Date.now();

  class Client {
    constructor() {
      this.cookies = [];
    }

    async request(path, options = {}) {
      const headers = options.headers || {};
      if (this.token) {
        headers['authorization'] = `Bearer ${this.token}`;
      }
      if (this.cookies.length > 0) {
        headers['cookie'] = this.cookies.join('; ');
      }
      if (options.body && typeof options.body === 'object') {
        headers['content-type'] = 'application/json';
        options.body = JSON.stringify(options.body);
      }

      const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
      });

      const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
      if (setCookies && setCookies.length > 0) {
        this.cookies = setCookies.map(c => c.split(';')[0]);
      } else {
        const raw = res.headers.get('set-cookie');
        if (raw) {
          this.cookies = [raw.split(';')[0]];
        }
      }

      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }

      if (!res.ok) {
        const error = new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
        error.status = res.status;
        error.data = data;
        throw error;
      }

      return data;
    }

    get(path) { return this.request(path, { method: 'GET' }); }
    post(path, body) { return this.request(path, { method: 'POST', body }); }
    patch(path, body) { return this.request(path, { method: 'PATCH', body }); }
    delete(path) { return this.request(path, { method: 'DELETE' }); }
  }

  const brandClient = new Client();
  const creatorClient = new Client();

  // 1. Register Brand
  console.log('1. Registering Brand user...');
  const brandEmail = `brand_${timestamp}@test.com`;
  const brandRegRes = await brandClient.post('/auth/register', {
    email: brandEmail,
    password: 'Password123!',
    role: 'BUSINESS',
    fullName: 'Apex Media Corp',
  });
  console.log('✅ Brand registered:', brandRegRes.data.user.email);

  // 2. Register Creator
  console.log('\n2. Registering Creator user...');
  const creatorEmail = `creator_${timestamp}@test.com`;
  const creatorRegRes = await creatorClient.post('/auth/register', {
    email: creatorEmail,
    password: 'Password123!',
    role: 'CREATOR',
    fullName: 'Maya Lin',
  });
  console.log('✅ Creator registered:', creatorRegRes.data.user.email);
  const creatorId = creatorRegRes.data.user.id;

  // Activate both users in database
  const path = require('path');
  const { PrismaClient } = require(path.resolve(__dirname, '../apps/api/node_modules/@prisma/client'));
  const prisma = new PrismaClient();
  await prisma.user.updateMany({
    where: { email: { in: [brandEmail, creatorEmail] } },
    data: { status: 'ACTIVE', emailVerifiedAt: new Date() },
  });
  console.log('✅ Users activated & verified in DB');

  // Log in both users to obtain JWT cookies & Bearer tokens
  const brandLoginRes = await brandClient.post('/auth/login', {
    email: brandEmail,
    password: 'Password123!',
  });
  brandClient.token = brandLoginRes.data.accessToken;
  console.log('✅ Brand logged in, token acquired');

  const creatorLoginRes = await creatorClient.post('/auth/login', {
    email: creatorEmail,
    password: 'Password123!',
  });
  creatorClient.token = creatorLoginRes.data.accessToken;
  console.log('✅ Creator logged in, token acquired');

  // Set creator profile
  await creatorClient.patch('/creators/me', {
    headline: 'Visual Storyteller & Tech Filmmaker',
    bio: 'Award-winning cinematographer crafting brand stories with 250k+ loyal followers.',
    niche: ['Tech & Gadgets', 'Creative & Art'],
  });
  console.log('✅ Creator profile initialized');

  // ==========================================
  // CHUNK 8: Creator Services & Pricing Packages
  // ==========================================
  console.log('\n--- CHUNK 8: Testing Creator Services & Pricing Packages ---');
  const packageRes = await creatorClient.post('/creators/me/services', {
    title: 'Cinematic 60s Product Reel',
    description: '4K color-graded reel with dynamic match-cuts, customized audio, and swipe-up product link.',
    platform: 'INSTAGRAM',
    format: 'Reel',
    price: 650,
    deliveryDays: 4,
    revisions: 2,
    features: ['4K Ultra HD', 'Full Commercial Rights', 'Link in Bio (14 days)', 'Raw footage access'],
  });
  const packageId = packageRes.data.id;
  console.log('✅ Created Service Package:', packageRes.data.title, `($${packageRes.data.price})`);

  // Verify public profile returns service packages
  const publicProfileRes = await brandClient.get(`/creators/${creatorId}`);
  const creatorProfile = publicProfileRes.data.profile || publicProfileRes.data;
  console.log('✅ Public profile includes active packages count:', creatorProfile.servicePackages.length);
  if (!creatorProfile.servicePackages || creatorProfile.servicePackages.length === 0) {
    throw new Error('Service packages missing from public creator profile');
  }

  // Update package
  const updatePkgRes = await creatorClient.patch(`/creators/me/services/${packageId}`, {
    price: 700,
  });
  console.log('✅ Updated Service Package price to:', updatePkgRes.data.price);

  // ==========================================
  // CHUNK 9: Campaign Applications & Invitations
  // ==========================================
  console.log('\n--- CHUNK 9: Testing Campaign Applications & Invitations ---');
  // Brand creates a campaign
  const campaignRes = await brandClient.post('/campaigns', {
    title: 'Aura Studio Microphone Fall Launch',
    description: 'Looking for tech creators and podcasters to review our flagship condenser mic.',
    budgetMin: 1500,
    budgetMax: 2500,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    platforms: ['INSTAGRAM', 'YOUTUBE'],
    niches: ['Tech & Gadgets'],
    deliverables: [
      { title: 'Instagram Reel', platform: 'INSTAGRAM', format: 'Reel', quantity: 1 },
      { title: 'YouTube Review', platform: 'YOUTUBE', format: 'Dedicated Video', quantity: 1 },
    ],
  });
  const campaignData = campaignRes.data.campaign || campaignRes.data;
  const campaignId = campaignData.id;
  console.log('✅ Brand created Campaign:', campaignData.title);

  // Creator applies to campaign
  const applicationRes = await creatorClient.post(`/campaigns/${campaignId}/apply`, {
    pitch: 'I have an acoustically treated studio and over 250k audio enthusiasts. I will do an A/B frequency response test!',
    proposedRate: 650,
  });
  const applicationId = applicationRes.data.id;
  console.log('✅ Creator applied to campaign with pitch. Status:', applicationRes.data.status);

  // Brand gets applications for campaign
  const brandAppsRes = await brandClient.get(`/campaigns/${campaignId}/applications`);
  const brandApps = Array.isArray(brandAppsRes.data) ? brandAppsRes.data : brandAppsRes.data.items || [];
  console.log('✅ Brand retrieved applications count:', brandApps.length);
  if (brandApps.length === 0) {
    throw new Error('Applications missing for brand campaign');
  }

  // Brand accepts application
  const acceptRes = await brandClient.patch(`/campaigns/${campaignId}/applications/${applicationId}/status`, {
    status: 'ACCEPTED',
    reviewNotes: 'Love the audio studio pitch! Looking forward to the results.',
  });
  console.log('✅ Brand accepted application. New status:', acceptRes.data.status);

  // Brand invites creator to campaign
  const creatorProfileData = await prisma.creatorProfile.findUnique({
    where: { userId: creatorId },
  });

  const inviteRes = await brandClient.post('/campaigns/invite', {
    campaignId,
    creatorProfileId: creatorProfileData.id,
    message: 'We would also love you to co-host our launch live stream!',
  });
  const invitationId = inviteRes.data.id;
  console.log('✅ Brand sent Campaign Invitation:', inviteRes.data.message);

  // Creator views invitations
  const creatorInvitesRes = await creatorClient.get('/creators/me/invitations');
  const creatorInvites = Array.isArray(creatorInvitesRes.data) ? creatorInvitesRes.data : creatorInvitesRes.data.items || [];
  console.log('✅ Creator received invitations count:', creatorInvites.length);

  // Creator accepts invitation
  const respondInviteRes = await creatorClient.patch(`/creators/me/invitations/${invitationId}/respond`, {
    status: 'ACCEPTED',
  });
  console.log('✅ Creator responded to invitation. Status:', respondInviteRes.data.status);

  // ==========================================
  // CHUNK 7: Messaging & Real-Time Chat
  // ==========================================
  console.log('\n--- CHUNK 7: Testing Messaging & Real-Time Chat ---');
  // Brand starts conversation with Creator
  const convRes = await brandClient.post('/conversations', {
    recipientId: creatorId,
    campaignId,
    initialMessage: 'Hey Maya! Welcome to the Aura Mic campaign. Where should we ship the sample unit?',
  });
  const conversationId = convRes.data.id;
  console.log('✅ Brand started conversation:', conversationId);

  // Creator checks conversations
  const creatorConvsRes = await creatorClient.get('/conversations');
  console.log('✅ Creator fetched conversations:', creatorConvsRes.data.length);
  const foundConv = creatorConvsRes.data.find((c) => c.id === conversationId);
  console.log('✅ Found conversation with unread count:', foundConv?.unreadCount);

  // Creator checks unread count badge
  const unreadRes = await creatorClient.get('/conversations/unread-count');
  console.log('✅ Creator unread messages count:', unreadRes.data.unreadCount);

  // Creator replies to brand
  const replyRes = await creatorClient.post(`/conversations/${conversationId}/messages`, {
    content: 'Awesome! Please ship to Studio 4B, 100 Broadway, New York NY 10003.',
  });
  console.log('✅ Creator sent reply message:', replyRes.data.content);

  // Brand reads conversation messages
  const messagesRes = await brandClient.get(`/conversations/${conversationId}/messages`);
  console.log('✅ Conversation messages count:', messagesRes.data.items.length);

  // Brand marks conversation as read
  const markReadRes = await brandClient.patch(`/conversations/${conversationId}/read`);
  console.log('✅ Brand marked conversation read:', markReadRes.data.success);

  console.log('\n🎉 ALL INTEGRATION TESTS FOR CHUNKS 7, 8, AND 9 PASSED WITH 100% SUCCESS!');
}

runIntegrationTest().catch((err) => {
  console.error('\n❌ Integration Test Failed:', err.data || err.message);
  process.exit(1);
});
