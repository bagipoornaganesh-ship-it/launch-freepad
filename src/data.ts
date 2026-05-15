import { DayPlan, Tool, Platform, OutreachMethod, OutreachChallenge, ProjectTemplate, RatePackage, FollowUpStep, Objection } from './types';

export const ROADMAP_DATA: DayPlan[] = [
  {
    day: 1,
    title: "Setup + First Outreach Attempt",
    theme: "Launch Day — No Waiting",
    color: "#6366f1",
    tasks: [
      { id: "d1-1", text: "Install DaVinci Resolve or CapCut Desktop", completed: false },
      { id: "d1-2", text: "Pick ONE niche (Finance, Fitness, Real Estate, Lifestyle, Tech YouTubers)", completed: false },
      { id: "d1-3", text: "Create dedicated Instagram or X business profile", completed: false },
      { id: "d1-4", text: "Write bio using \"I help [niche] creators get more views with professional edits\"", completed: false },
      { id: "d1-5", text: "Send 20 DMs with free trial offer", completed: false },
      { id: "d1-6", text: "Track all prospects in Client Tracker", completed: false },
    ],
    proTip: "Don't wait until your portfolio is perfect. Start outreach Day 1. Portfolio builds on Day 2."
  },
  {
    day: 2,
    title: "Portfolio + Free Trial Offer",
    theme: "Your Work Is Your Sales Page",
    color: "#ec4899",
    tasks: [
      { id: "d2-1", text: "Edit 3 sample videos using stock footage from Pexels or Pixabay", completed: false },
      { id: "d2-2", text: "Sample 1: 60-sec Value Reel with captions", completed: false },
      { id: "d2-3", text: "Sample 2: High-energy vlog intro with music sync", completed: false },
      { id: "d2-4", text: "Sample 3: Clean talking head with B-roll", completed: false },
      { id: "d2-5", text: "Upload all 3 to Notion page or Google Drive", completed: false },
      { id: "d2-6", text: "Send 20 fresh DMs + follow up Day 1 no-replies", completed: false },
      { id: "d2-7", text: "Post 1 sample on Instagram with niche hashtags", completed: false },
    ],
    proTip: "Free Trial is your weapon. Nobody says no to free. Get your first yes today."
  },
  {
    day: 3,
    title: "Build Your Prospect Hit-List",
    theme: "Know Who You're Targeting",
    color: "#f59e0b",
    tasks: [
      { id: "d3-1", text: "Search Instagram hashtags for your niche", completed: false },
      { id: "d3-2", text: "Find 20 creators with 1k-50k followers", completed: false },
      { id: "d3-3", text: "Qualify each: posting regularly? inconsistent edit quality?", completed: false },
      { id: "d3-4", text: "Save all 20 in Client Tracker with handle + notes", completed: false },
      { id: "d3-5", text: "Send 20 DMs to new prospects from hit-list", completed: false },
      { id: "d3-6", text: "Study their last 3 posts — what's bad about their current edits?", completed: false },
    ],
    proTip: "1k-50k followers is the sweet spot. Big enough to pay, small enough to reply."
  },
  {
    day: 4,
    title: "Pricing + 20 Daily DMs",
    theme: "Set Your Price, Scale the Pitch",
    color: "#10b981",
    tasks: [
      { id: "d4-1", text: "Set your packages in Rate Card", completed: false },
      { id: "d4-2", text: "Set payment method (PayPal or Wise)", completed: false },
      { id: "d4-3", text: "Send 20 DMs using AI DM Generator", completed: false },
      { id: "d4-4", text: "Mention their specific weak editing point in each DM", completed: false },
      { id: "d4-5", text: "Offer Free Trial in every DM", completed: false },
      { id: "d4-6", text: "Follow up with Day 2 DMs no reply", completed: false },
    ],
    proTip: "Lead with the free trial. You are not asking for money — you are asking for a chance."
  },
  {
    day: 5,
    title: "Follow-Ups + 20 Daily DMs",
    theme: "Persistence Is the Strategy",
    color: "#3b82f6",
    tasks: [
      { id: "d5-1", text: "Send follow-ups to all Day 3 and Day 4 DMs with no reply", completed: false },
      { id: "d5-2", text: "Use Follow-Up Sequence generator for scripts", completed: false },
      { id: "d5-3", text: "Send 20 fresh DMs to new prospects", completed: false },
      { id: "d5-4", text: "Post your second sample edit on Instagram", completed: false },
      { id: "d5-5", text: "Comment genuinely on 10 creator posts in your niche", completed: false },
    ],
    proTip: "80% of replies come after follow-up. Silence is not rejection."
  },
  {
    day: 6,
    title: "Handle Replies + 20 Daily DMs",
    theme: "Convert Interest Into Commitment",
    color: "#8b5cf6",
    tasks: [
      { id: "d6-1", text: "Check all replies — use Objection Handler for any pushback", completed: false },
      { id: "d6-2", text: "For interested prospects: confirm Free Trial", completed: false },
      { id: "d6-3", text: "Get their raw footage or topic brief", completed: false },
      { id: "d6-4", text: "Send 20 DMs + handle all replies today", completed: false },
      { id: "d6-5", text: "Send final follow-up to all remaining non-replies", completed: false },
    ],
    proTip: "Speed wins. If someone replies, respond within 1 hour. Fast = professional."
  },
  {
    day: 7,
    title: "Deliver Trial + 20 Daily DMs",
    theme: "Turn Free Into Paid",
    color: "#ef4444",
    tasks: [
      { id: "d7-1", text: "Deliver the Free Trial Reel to client", completed: false },
      { id: "d7-2", text: "Ask for honest feedback", completed: false },
      { id: "d7-3", text: "Once they love it → pitch Starter Pack ($25)", completed: false },
      { id: "d7-4", text: "Send 20 DMs if no client yet, do not stop", completed: false },
      { id: "d7-5", text: "Review the week: what worked, what did not", completed: false },
    ],
    proTip: "Free trial client loved your work? That is your first paying client. Ask now."
  },
];

export const WEEK2_ROADMAP_DATA: DayPlan[] = [
  {
    day: 8,
    title: "Fresh Assault",
    theme: "Persistence Day",
    color: "#6366f1",
    tasks: [
      { id: "d8-1", text: "Send 20 fresh DMs to new prospects", completed: false },
      { id: "d8-2", text: "Follow up every single Week 1 DM with no reply", completed: false },
      { id: "d8-3", text: "Use Follow-Up Sequence generator for scripts", completed: false },
      { id: "d8-4", text: "Track all new prospects in Client Tracker", completed: false },
    ],
    proTip: "Week 2 is where the 'silent' leads finally start talking."
  },
  {
    day: 9,
    title: "Visibility Push",
    theme: "Social Presence",
    color: "#ec4899",
    tasks: [
      { id: "d9-1", text: "Post a new sample edit on Instagram or TikTok", completed: false },
      { id: "d9-2", text: "Engage genuinely on 10 creator posts in your niche", completed: false },
      { id: "d9-3", text: "Send 20 fresh DMs today", completed: false },
      { id: "d9-4", text: "Reply to any pending messages within 1 hour", completed: false },
    ],
    proTip: "Being a fan first makes the DM much warmer."
  },
  {
    day: 10,
    title: "Script Refinement",
    theme: "Message Optimization",
    color: "#f59e0b",
    tasks: [
      { id: "d10-1", text: "Analyze which DMs got replies vs ignored", completed: false },
      { id: "d10-2", text: "Rewrite your DM hook based on what worked", completed: false },
      { id: "d10-3", text: "Send 20 DMs with the new script", completed: false },
      { id: "d10-4", text: "Track all data in Outreach Log", completed: false },
    ],
    proTip: "If no one is opening, change the subject. If no one is replying, change the offer."
  },
  {
    day: 11,
    title: "Platform Expansion",
    theme: "Channel Diversification",
    color: "#10b981",
    tasks: [
      { id: "d11-1", text: "Apply to 3 gigs on Fiverr or Upwork", completed: false },
      { id: "d11-2", text: "Optimize your gig title and tags for SEO", completed: false },
      { id: "d11-3", text: "Send 20 fresh DMs today", completed: false },
      { id: "d11-4", text: "Add 20 new prospects to your hit-list", completed: false },
    ],
    proTip: "Don't put all your eggs in the DM basket. Job boards are active buyers."
  },
  {
    day: 12,
    title: "Follow-Up Blitz",
    theme: "Mass Follow-Up",
    color: "#3b82f6",
    tasks: [
      { id: "d12-1", text: "Follow up everyone who has not replied yet", completed: false },
      { id: "d12-2", text: "Send final breakup DM to cold leads", completed: false },
      { id: "d12-3", text: "Send 20 fresh DMs to new prospects today", completed: false },
      { id: "d12-4", text: "Check if any free trial client needs follow-up", completed: false },
    ],
    proTip: "The money is in the follow-up. 90% of your competitors quit by Day 12."
  },
  {
    day: 13,
    title: "Content + Outreach",
    theme: "Social Proof Boost",
    color: "#8b5cf6",
    tasks: [
      { id: "d13-1", text: "Post your third sample edit with niche hashtags", completed: false },
      { id: "d13-2", text: "Send 20 DMs to fresh prospects", completed: false },
      { id: "d13-3", text: "Comment on 10 creator posts genuinely", completed: false },
      { id: "d13-4", text: "Review your Client Tracker — update all statuses", completed: false },
    ],
    proTip: "Showing how you work builds more trust than just showing the result."
  },
  {
    day: 14,
    title: "2-Week Review",
    theme: "The 14-Day Sprint Finish",
    color: "#ef4444",
    tasks: [
      { id: "d14-1", text: "Count total DMs sent across 2 weeks", completed: false },
      { id: "d14-2", text: "Send 20 DMs if you haven't hit target yet", completed: false },
      { id: "d14-3", text: "If 0 clients: rewrite offer and restart Week 1", completed: false },
      { id: "d14-4", text: "If 1+ client: pitch Starter Pack ($25) today", completed: false },
      { id: "d14-5", text: "Plan Week 3 based on what worked", completed: false },
    ],
    proTip: "Day 14 with no client is normal. Day 14 with no effort is the problem."
  },
];

export const NICHES = [
  { id: 'finance', name: 'Finance YouTubers', description: 'Focus on retention, subtle graphics, and clear graphs.' },
  { id: 'fitness', name: 'Fitness / Bodybuilding', description: 'High energy, speed ramps, and motivational sound design.' },
  { id: 'real_estate', name: 'Real Estate / Luxury', description: 'Smooth transitions, elegant color grading, and upscale vibe.' },
  { id: 'tech', name: 'Tech / Gadgets', description: 'Fast cuts, digital overlays, and crisp sound effects.' },
  { id: 'lifestyle', name: 'Lifestyle / Vlog', description: 'Storytelling focus, natural colors, and mood-setting music.' },
];

export const BASE_DM_TEMPLATES = [
  {
    category: "Cold Outreach",
    templates: [
      "Hey [Name]! Love the content you're putting out, especially the last video about [Topic]. I noticed your editing could be even punchier with some [Technique]. I'm a video editor specializing in [Niche] and I'd love to do a free 30-sec sample for your next video. Any interest?",
      "Hi [Name], I've been following your channel for a while. Your storytelling is great, but I think better color grading and jump cuts could increase your retention. I've worked with [Niche] creators before. Would you be open to seeing my portfolio?",
      "Hey [Name]! Just saw your recent reel. I help [Niche] creators save 10+ hours a week by handling their editing. I've got a couple of slots open this week—could we chat about how I can take editing off your plate?"
    ]
  },
  {
    category: "Warm Outreach",
    templates: [
      "Hey [Name], thanks for liking my recent post about [Topic]! I saw you're also in the [Niche] space. Out of curiosity, do you handle all your own editing or do you have a team?",
      "Hi [Name], appreciate the comment on my video! Just checked out your profile—your [Niche] content is awesome. If you ever need help scaling your content with custom edits, let's chat!"
    ]
  }
];

export const DM_TEMPLATES = BASE_DM_TEMPLATES;

export const FOLLOW_UP_SEQUENCES: Record<string, FollowUpStep[]> = {
  finance: [
    { day: 1, type: 'Direct Value', script: "Hey [Name]! Just adding to my last msg—I put together a 30s sample of your last video showcasing how some dynamic graphs could boost retention. Want to see it?" },
    { day: 3, type: 'Social Proof', script: "Hi [Name], just checking in. I recently helped another creator in the finance niche increase their CTR by 15% with a new intro style. Would love to share the strategy with you." },
    { day: 7, type: 'The Breakup', script: "Hey [Name], I assume you're busy or already sorted for editing. I'll take this off your plate for now, but feel free to reach out if you ever need a high-retention edit on short notice!" }
  ],
  fitness: [
    { day: 1, type: 'Energy Shift', script: "Hey [Name]! I re-edited a 15s clip of your workout with some custom sound design and speed ramps. Really makes those PRs pop. Mind if I send the link?" },
    { day: 3, type: 'Consistency', script: "Hi [Name], noticed you've been posting daily! If you ever want to save 10+ hours a week on those edits to focus more on training/clients, let's talk about a trial." },
    { day: 7, type: 'Open Door', script: "Hey [Name], moving on for now! Love the energy you're bringing to the niche. I'm here if you ever need a secondary editor for high-ticket reel launches." }
  ],
};

export const OBJECTIONS: Objection[] = [
  { trigger: "Price is too high", response: "I totally understand. My pricing reflects the ROI we're aiming for—saving you X hours and increasing retention by Y%. Would you like to start with a smaller 'Trial Reel' for $[Small Amount]?" },
  { trigger: "I already have an editor", response: "That's great! It's always a good idea to have a backup. If you ever have a rush project or your current editor takes a break, I'd love to be your first call. Can I send a 30s sample for your files?" },
  { trigger: "Not looking for anyone right now", response: "No problem at all! I'll check back in a few months. In the meantime, I'm happy to send over some free feedback on your latest vid if you're open to it?" },
  { trigger: "Can you do it for free first?", response: "I don't do full videos for free, but I'm more than happy to do a 30-60 second sample of your current footage so you can see exactly how I'd level up your brand before you commit." },
];

export const PORTFOLIO_CHECKLIST = [
  { id: 'reel_value', title: 'High-Value Reel with Captions', description: 'Showcase your ability to keep viewers engaged with movement and text.' },
  { id: 'long_form_intro', title: '30-Sec YouTube Hook/Intro', description: 'Prove you can stop the scroll and establish the video goal quickly.' },
  { id: 'talking_head', title: 'Clean Talking Head Segment', description: 'Demonstrate fundamental skills: color grading, audio cleanup, and pacing.' },
  { id: 'shorts_fast', title: 'High-Energy YT Shorts / TikTok', description: 'Rapid-fire edits designed for maximum retention on short-form platforms.' },
  { id: 'ad_style', title: 'Course/Product Promo Edit', description: 'Direct response style editing that drives specific user actions.' },
];

export const INITIAL_INTL_RATES: RatePackage[] = [
  { id: 'intl_free', name: 'Free Trial', price: '$0', deliverables: ['1 Reel edit (sample work)', 'Showcase value', '48h Delivery'] },
  { id: 'intl_starter', name: 'Starter', price: '$25', deliverables: ['3 Reels', 'Perfect for first client', 'Fast turnaround'] },
  { id: 'intl_basic', name: 'Basic', price: '$75', deliverables: ['8 Reels per month', 'Subtitles included', 'Sound Design'] },
  { id: 'intl_standard', name: 'Standard', price: '$149', deliverables: ['15 Reels edits', '1 Long-form edit', 'Priority Support'] },
];

export const TOOLS: Tool[] = [
  { name: "DaVinci Resolve", useCase: "Industry standard editing & color grading", cost: "Free / $295", link: "https://www.blackmagicdesign.com/products/davinciresolve", category: "Software" },
  { name: "CapCut Desktop", useCase: "Fast, AI-powered Reels/Shorts editing", cost: "Free", link: "https://www.capcut.com/", category: "Software" },
  { name: "Pexels", useCase: "Free high-quality stock footage", cost: "Free", link: "https://www.pexels.com/", category: "Stock" },
  { name: "Coverr", useCase: "Cinematic stock background videos", cost: "Free", link: "https://coverr.co/", category: "Stock" },
  { name: "Mixkit", useCase: "Free stock music and sound effects", cost: "Free", link: "https://mixkit.co/", category: "Music" },
  { name: "YT Audio Library", useCase: "Copyright-free music for YouTube", cost: "Free", link: "https://youtube.com/audiolibrary", category: "Music" },
  { name: "Canva", useCase: "Thumbnails, Rate Cards, Portfolios", cost: "Free / Paid", link: "https://www.canva.com/", category: "Design" },
  { name: "WeTransfer", useCase: "Sending large video files to clients", cost: "Free (up to 2GB)", link: "https://wetransfer.com/", category: "Delivery" },
  { name: "Notion", useCase: "Client tracking, Portfolios, Scripts", cost: "Free", link: "https://www.notion.so/", category: "Portfolio" },
  { name: "Upwork", useCase: "Finding high-ticket freelance clients", cost: "Free", link: "https://www.upwork.com/", category: "Clients" },
  { name: "Fiverr", useCase: "The 'Amazon' of freelance services", cost: "Free", link: "https://www.fiverr.com/", category: "Clients" }
];

export const PLATFORMS: Platform[] = [
  { name: "Instagram DMs", strategy: "Find creators, watch their reels, send personalized loom/DM.", difficulty: "Medium", expectedResponse: "5-10%", bestForBeginners: true },
  { name: "YouTube Comments", strategy: "Find growing channels (<50k subs), leave helpful feedback, mention you're an editor.", difficulty: "Low", expectedResponse: "2-5%" },
  { name: "Facebook Groups", strategy: "Join 'Video Editors' or 'Content Creators' groups. Answer questions, then soft-pitch.", difficulty: "Low", expectedResponse: "5-8%", bestForBeginners: true },
  { name: "Fiverr", strategy: "Optimize SEO tags, use a professional video intro for your gig.", difficulty: "High", expectedResponse: "Variable", bestForBeginners: true },
  { name: "LinkedIn", strategy: "Connect with marketing managers and content heads. Share your 'behind the scenes'.", difficulty: "High", expectedResponse: "3-5%" },
  { name: "Reddit", strategy: "Browse r/CreatorServices or r/HireAnEditor. Be extremely fast to reply.", difficulty: "Medium", expectedResponse: "5-10%" }
];

export const OUTREACH_METHODS: OutreachMethod[] = [
  {
    id: "om-1",
    name: "The Loom Strategy",
    description: "Send a short (60s) video critique of one of their recent videos. Show, don't just tell, that you can edit.",
    difficulty: "High",
    expectedResponse: "15-25%",
    steps: [
      "Find a creator in your niche with 10k-50k followers.",
      "Record a screen share using Loom or OBS.",
      "Point out 2-3 specific areas for improvement (lighting, pacing, captions).",
      "Draft a 10s sample edit of their footage if possible.",
      "Send the Loom link via DM with a low-pressure message."
    ]
  },
  {
    id: "om-2",
    name: "The 'Value-First' Commenting",
    description: "Build rapport before DMing by leaving insightful comments on their YouTube or Instagram content.",
    difficulty: "Medium",
    expectedResponse: "8-12%",
    steps: [
      "Set up post notifications for 10 creators in your niche.",
      "When they post, leave a comment that summarizes the main value or adds to the conversation.",
      "Wait for them to like or reply to your comment.",
      "Transition to DM: 'Hey, loved your reply on the latest post! Just wanted to reach out...'"
    ]
  },
  {
    id: "om-3",
    name: "The Portfolio Blast",
    description: "High-volume outreach focused on showcasing a highly relevant portfolio to specific industries.",
    difficulty: "Low",
    expectedResponse: "3-5%",
    steps: [
      "Curate 3 samples specifically for a sub-niche (e.g. SaaS Ads).",
      "Use Instagram Search or LinkedIn to find 'Marketing Managers' or 'Heads of Content'.",
      "Send a direct, professional pitch with the link and a clear call to action."
    ]
  },
  {
    id: "om-4",
    name: "Reddit 'Pain Solver'",
    description: "Find creators asking for help or venting about workflow pains in specialized subreddits.",
    difficulty: "Medium",
    expectedResponse: "10-15%",
    steps: [
      "Browse r/CreatorServices, r/HireAnEditor, or niche-specific subreddits.",
      "Look for 'How do I...' or 'Need help with...' posts.",
      "Reply with a detailed, high-value answer publicly first.",
      "Send a DM referencing your comment and offering a trial project to solve that specific pain."
    ]
  },
  {
    id: "om-5",
    name: "LinkedIn Business Specialist",
    description: "Target B2B creators and business owners who value ROI and retention over just 'cool' edits.",
    difficulty: "High",
    expectedResponse: "5-8%",
    steps: [
      "Optimize your LinkedIn profile to focus on 'Video Retention Specialist'.",
      "Share 1 case study/edit per week showing 'Profit/View' improvements.",
      "Connect with Heads of Growth/Content at startups in your niche.",
      "Send a 'Soft Connection' message focusing on a common business interest before pitching."
    ]
  }
];

export const OUTREACH_CHALLENGES: OutreachChallenge[] = [
  {
    id: "oc-1",
    difficulty: "Getting ignored or left on read constantly.",
    solution: "Your hook is likely too self-centered. Start with a question about their goals or a specific compliment that PROVES you watched their content. Also, follow up at least 3 times.",
    category: "Social"
  },
  {
    id: "oc-2",
    difficulty: "Getting blocked or restricted by platform limits (DM Jail).",
    solution: "Don't send more than 20-30 DMs per day on a new account. Mix in 'Warm Outreach' (talking to people who follow you or engage with your posts) to bypass filters.",
    category: "Technical"
  },
  {
    id: "oc-3",
    difficulty: "Fear of sounding 'Salesy' or annoying.",
    solution: "Shift your mindset from 'Taking their money' to 'Helping them grow'. If your editing really saves them 10 hours, you are doing them a favor by reaching out.",
    category: "Mindset"
  },
  {
    id: "oc-4",
    difficulty: "Prospect says 'I already have an editor'.",
    solution: "Perfect! Say: 'That's great! It's always good to have a backup. If you ever have a rush project or your editor is busy, keep me in mind.' Then ask if you can send a 30s sample for their 'reserve' file.",
    category: "Social"
  },
  {
    id: "oc-5",
    difficulty: "Overwhelmed by tracking different conversations.",
    solution: "Use the 'Client Tracker' in this Launchpad daily. Every time you send a DM, it goes in the tracker immediately. Set follow-up dates and stick to them.",
    category: "Technical"
  },
  {
    id: "oc-6",
    difficulty: "Clients asking for long-form work for free ('Exposure').",
    solution: "Politely decline free full-length videos. Instead, offer a 'Paid Small-Scale Trial' (e.g., a 15-30s high-impact segment) at a discounted rate. Emphasize that your professional expertise and tools (DaVinci, paid plugins) ensure their retention/ROI, which 'free' shortcuts can't match. Value your time, and they will too.",
    category: "Social"
  }
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "pt-1",
    name: "Hyper-Retention Reel",
    description: "Designed for high-engagement Instagram Reels/TikToks with constant movement and visual hooks.",
    videoType: "Reels",
    trackLayout: [
      { name: "V1: Main A-Roll", type: "Video", description: "Primary footage with talking head" },
      { name: "V2: B-Roll & Overlays", type: "Video", description: "Visual metaphors and context clips" },
      { name: "V3: Dynamic Captions", type: "Text", description: "Animated word-by-word captions" },
      { name: "A1: Cleaned Voiceover", type: "Audio", description: "AI-enhanced or studio recorded voice" },
      { name: "A2: SFX (Whooshes/Pops)", type: "Audio", description: "Interaction sound markers" },
      { name: "A3: High-Energy Music", type: "Audio", description: "Subtle background music with side-chaining" }
    ],
    commonEffects: ["J-Cuts & L-Cuts", "Motion Blur on movement", "Gaussian Blur background overlays", "Zoom Transitions"],
    proTip: "Every 2nd or 3rd word should have a visual change (B-roll, caption color, or zoom) to keep the viewer from scrolling."
  },
  {
    id: "pt-2",
    name: "Classic YouTube Intro",
    description: "The first 30 seconds that decide if a viewer stays or leaves.",
    videoType: "YouTube Intro",
    trackLayout: [
      { name: "V1: Preview/Hook CLIP", type: "Video", description: "Most exciting 3 seconds of the video" },
      { name: "V2: Branded Intro GFX", type: "Graphics", description: "Channel logo animation" },
      { name: "V3: Face Cam / A-Roll", type: "Video", description: "The setup of the video goal" },
      { name: "A1: Main Audio", type: "Audio", description: "Primary narrative" },
      { name: "A2: Intro Sting", type: "Audio", description: "High-impact brand sound" },
      { name: "A3: Suspenseful Music", type: "Audio", description: "Builds tension during the hook" }
    ],
    commonEffects: ["Text Pop-ups", "Slow Zoom-in", "Speed Ramps", "Sound Design hits"],
    proTip: "Don't introduce yourself until AFTER the hook. Sell the 'Dream Outcome' of the video in the first 5 seconds."
  },
  {
    id: "pt-3",
    name: "Minimalist Talking Head",
    description: "A clean, professional look for corporate, education, or thought leadership content.",
    videoType: "Talking Head",
    trackLayout: [
      { name: "V1: Color Graded A-Roll", type: "Video", description: "Main person talking" },
      { name: "V2: Lower Third Clips", type: "Text", description: "Name/Title and key points" },
      { name: "A1: Primary Dialogue", type: "Audio", description: "Crisp voice with low-end boost" },
      { name: "A2: Lo-Fi/Corporate Music", type: "Audio", description: "Low volume, steady rhythm" }
    ],
    commonEffects: ["Color Grade (Cinematic)", "De-noised Audio", "Soft Vignette", "Subtle Lower Thirds"],
    proTip: "Empty space is okay here. Focus on the audio quality—if it sounds 'cheap', the whole video feels unprofessional."
  }
];
