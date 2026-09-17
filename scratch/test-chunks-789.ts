import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

async function runIntegrationTest() {
  console.log('🚀 Starting Integration Test for Chunks 7, 8, and 9...\n');
  const timestamp = Date.now();

  // Create Axios instance with cookie jar support
  const brandClient = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
  });

  const creatorClient = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
  });

  // Helper to extract cookies
  function forwardCookie(fromRes: any, toClient: any) {
    const cookies = fromRes.headers['set-cookie'];
    if (cookies) {
      toClient.defaults.headers.common['Cookie'] = cookies.map((c: string) => c.split(';')[0]).join('; ');
    }
  }

  // 1. Register Brand
  console.log('1. Registering Brand user...');
  const brandEmail = `brand_${timestamp}@test.com`;
  const brandRes = await brandClient.post('/auth/register', {
    email: brandEmail,
    password: 'Password123!',
    role: 'BUSINESS',
    name: 'Acme Brands Inc',
  });
  forwardCookie(brandRes, brandClient);
  console.log('✅ Brand registered:', brandRes.data.data.user.email);

  // 2. Register Creator
  console.log('\n2. Registering Creator user...');
  const creatorEmail = `creator_${timestamp}@test.com`;
  const creatorRes = await creatorClient.post('/auth/register', {
    email: creatorEmail,
    password: 'Password123!',
    role: 'CREATOR',
    name: 'Alex Rivera',
  });
  forwardCookie(creatorRes, creatorClient);
  console.log('✅ Creator registered:', creatorRes.data.data.user.email);
  const creatorId = creatorRes.data.data.user.id;

  // Set creator profile
  await creatorClient.patch('/creators/me', {
    headline: 'Tech & Lifestyle Creator (150K followers)',
    bio: 'Creating cinematic tech reviews and product walkthroughs.',
    niche: ['Tech & Gadgets', 'Lifestyle'],
  });
  console.log('✅ Creator profile initialized');

  // ==========================================
  // CHUNK 8: Creator Services & Pricing Packages
  // ==========================================
  console.log('\n--- CHUNK 8: Testing Creator Services & Pricing Packages ---');
  const packageRes = await creatorClient.post('/creators/me/services', {
    title: 'Dedicated 60s Tech Review Reel',
    description: 'Full 4K dedicated reel with custom voiceover, B-roll product showcase, and link in bio.',
    platform: 'INSTAGRAM',
    deliverableType: 'REEL',
    price: 499,
    turnaroundDays: 3,
    revisions: 2,
    features: ['4K Ultra HD', 'Raw footage included', '7-day bio link', 'Cross-posted to Shorts'],
  });
  const packageId = packageRes.data.data.id;
  console.log('✅ Created Service Package:', packageRes.data.data.title, `($${packageRes.data.data.price})`);

  // Verify public profile returns service packages
  const publicProfileRes = await brandClient.get(`/creators/${creatorId}`);
  const creatorProfile = publicProfileRes.data.data;
  console.log('✅ Public profile includes active packages:', creatorProfile.servicePackages.length);
  if (creatorProfile.servicePackages.length === 0) {
    throw new Error('Service packages missing from public creator profile');
  }

  // Update package
  const updatePkgRes = await creatorClient.patch(`/creators/me/services/${packageId}`, {
    price: 550,
  });
  console.log('✅ Updated Service Package price to:', updatePkgRes.data.data.price);

  // ==========================================
  // CHUNK 9: Campaign Applications & Invitations
  // ==========================================
  console.log('\n--- CHUNK 9: Testing Campaign Applications & Invitations ---');
  // Brand creates a campaign
  const campaignRes = await brandClient.post('/campaigns', {
    title: 'Neon Sound Pro Headphones Launch',
    description: 'Looking for creators to test our noise-cancelling headphones in urban settings.',
    budget: 2000,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    platforms: ['INSTAGRAM', 'YOUTUBE'],
    niches: ['Tech & Gadgets'],
    deliverables: [
      { type: 'REEL', count: 1, platform: 'INSTAGRAM' },
      { type: 'STORY', count: 2, platform: 'INSTAGRAM' },
    ],
  });
  const campaignId = campaignRes.data.data.id;
  console.log('✅ Brand created Campaign:', campaignRes.data.data.title);

  // Creator applies to campaign
  const applicationRes = await creatorClient.post(`/campaigns/${campaignId}/apply`, {
    pitch: 'I have tested 50+ pairs of ANC headphones on my channel. My audience loves sound quality breakdowns!',
    proposedRate: 500,
    deliverables: ['1x Instagram Reel', '2x Story frames with swipe-up'],
  });
  const applicationId = applicationRes.data.data.id;
  console.log('✅ Creator applied to campaign with pitch. Status:', applicationRes.data.data.status);

  // Brand gets applications for campaign
  const brandAppsRes = await brandClient.get(`/campaigns/${campaignId}/applications`);
  console.log('✅ Brand retrieved applications count:', brandAppsRes.data.data.items.length);
  if (brandAppsRes.data.data.items.length === 0) {
    throw new Error('Applications missing for brand campaign');
  }

  // Brand accepts application
  const acceptRes = await brandClient.patch(`/campaigns/${campaignId}/applications/${applicationId}/status`, {
    status: 'ACCEPTED',
    notes: 'Excited to work together, Alex!',
  });
  console.log('✅ Brand accepted application. New status:', acceptRes.data.data.status);

  // Brand invites creator to another campaign or tests invitation
  const inviteRes = await brandClient.post('/campaigns/invite', {
    campaignId,
    creatorId,
    message: 'We also have a second product line we would love to collaborate on!',
  });
  const invitationId = inviteRes.data.data.id;
  console.log('✅ Brand sent Campaign Invitation:', inviteRes.data.data.message);

  // Creator views invitations
  const creatorInvitesRes = await creatorClient.get('/creators/me/invitations');
  console.log('✅ Creator received invitations count:', creatorInvitesRes.data.data.items.length);

  // Creator accepts invitation
  const respondInviteRes = await creatorClient.patch(`/creators/me/invitations/${invitationId}/respond`, {
    status: 'ACCEPTED',
  });
  console.log('✅ Creator responded to invitation. Status:', respondInviteRes.data.data.status);

  // ==========================================
  // CHUNK 7: Messaging & Real-Time Chat
  // ==========================================
  console.log('\n--- CHUNK 7: Testing Messaging & Real-Time Chat ---');
  // Brand starts conversation with Creator
  const convRes = await brandClient.post('/conversations', {
    participantId: creatorId,
    campaignId,
    initialMessage: 'Hey Alex, welcome aboard the Neon Sound campaign! Here are the style guidelines.',
  });
  const conversationId = convRes.data.data.id;
  console.log('✅ Brand started conversation:', conversationId);

  // Creator checks conversations
  const creatorConvsRes = await creatorClient.get('/conversations');
  console.log('✅ Creator fetched conversations:', creatorConvsRes.data.data.length);
  const foundConv = creatorConvsRes.data.data.find((c: any) => c.id === conversationId);
  console.log('✅ Found conversation with unread count:', foundConv?.unreadCount);

  // Creator checks unread count badge
  const unreadRes = await creatorClient.get('/conversations/unread-count');
  console.log('✅ Creator unread messages count:', unreadRes.data.data.unreadCount);

  // Creator replies to brand
  const replyRes = await creatorClient.post(`/conversations/${conversationId}/messages`, {
    content: 'Thank you! Received the brief. Looking forward to drafting the storyboard tomorrow.',
  });
  console.log('✅ Creator sent reply message:', replyRes.data.data.content);

  // Brand reads conversation messages
  const messagesRes = await brandClient.get(`/conversations/${conversationId}/messages`);
  console.log('✅ Conversation messages count:', messagesRes.data.data.items.length);

  // Brand marks conversation as read
  const markReadRes = await brandClient.patch(`/conversations/${conversationId}/read`);
  console.log('✅ Brand marked conversation read:', markReadRes.data.data.success);

  console.log('\n🎉 ALL INTEGRATION TESTS FOR CHUNKS 7, 8, AND 9 PASSED SUCCESSFULLY!');
}

runIntegrationTest().catch((err) => {
  console.error('❌ Integration Test Failed:', err.response?.data || err.message);
  process.exit(1);
});
