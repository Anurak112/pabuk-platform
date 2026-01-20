# Pabuk Point System - Development Roadmap & Requirements

## Project Overview

**Project Name:** Pabuk Contribution Point System
**Platform:** Cultural Data Crowdsourcing (Thailand's 77 Provinces)
**Tech Stack:** Next.js 16, React 19, Prisma, PostgreSQL, TypeScript
**Goal:** Implement a comprehensive gamification system to incentivize quality cultural contributions

### Current State
- ✅ Next.js 16 project initialized
- ✅ Prisma PostgreSQL database configured
- ✅ NextAuth.js authentication integrated
- ✅ Core models: User, Contribution, Province, Review, Tag
- ✅ GLM API configured
- ❌ Point system not yet implemented

---

## 1. Technical Requirements

### 1.1 Core Functionality

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| Point Calculation Engine | Critical | High | Calculate points based on rules in POINT_SYSTEM_DESIGN.md |
| Database Schema Updates | Critical | Medium | Add point-related fields to existing models |
| User Dashboard | Critical | Medium | Display points, badges, streaks, achievements |
| Admin Point Management | High | Medium | Manual adjustments, penalties, reviews |
| Quality Rating System | Critical | High | 1-5 star rating with multipliers |
| Milestone Tracking | High | Medium | Achievements, badges, level progression |
| Geographic Tracking | High | Medium | Province coverage, regional bonuses |
| Streak System | Medium | Medium | Daily/weekly/monthly contribution tracking |
| Leaderboard System | Medium | High | Real-time rankings with multiple categories |
| Anti-Gaming System | Critical | High | Rate limiting, duplicate detection, penalties |
| Notification System | High | Medium | Point updates, achievements, streaks |
| Analytics Dashboard | Medium | High | Metrics, monitoring, A/B testing |
| Referral System | Low | Medium | User referral tracking and rewards |

### 1.2 Database Schema Changes

#### New Models to Add

```prisma
// Extend existing User model
model User {
  // Existing fields...

  // Point system fields
  points                  Int      @default(0)
  level                   String   @default("Bronze")
  referralCode            String?  @unique
  referredBy              String?
  streak                  Int      @default(0)
  lastContributionAt      DateTime?
  totalContributions      Int      @default(0)
  approvedContributions   Int      @default(0)
  provincesCovered        Int      @default(0)
  averageQualityRating    Float    @default(0)

  // Relations
  pointTransactions       PointTransaction[]
  achievements            Achievement[]
  givenReviews            QualityReview[]
  receivedRatings         QualityReview[]  @relation("RatedReviews")
}

// Extend existing Contribution model
model Contribution {
  // Existing fields...

  // Point system fields
  pointsAwarded           Int      @default(0)
  qualityRating           Int?     // 1-5 stars
  isFeatured              Boolean  @default(false)
  featuredAt              DateTime?
  reviewerIds             String[] // Array of reviewer IDs who rated
  calculatedAt            DateTime? // When points were calculated

  // Relations
  pointTransactions       PointTransaction[]
  qualityRatings          QualityReview[]
}

// New models
model PointTransaction {
  id              String   @id @default(cuid())
  userId          String
  type            TransactionType
  amount          Int
  reason          String   @db.Text
  contributionId  String?
  metadata        Json?
  createdAt       DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id])
  contribution    Contribution? @relation(fields: [contributionId], references: [id])

  @@index([userId])
  @@index([type])
  @@index([createdAt])
}

model Achievement {
  id              String   @id @default(cuid())
  userId          String
  badgeName       String
  badgeType       BadgeType
  badgeIcon       String?  // URL or emoji
  description     String?
  metadata        Json?    // Store achievement-specific data
  earnedAt        DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id])

  @@unique([userId, badgeName])
  @@index([userId])
  @@index([badgeType])
}

model QualityReview {
  id              String   @id @default(cuid())
  contributionId  String
  reviewerId      String
  rating          Int      // 1-5 stars
  feedback        String?  @db.Text
  createdAt       DateTime @default(now())

  contribution    Contribution @relation(fields: [contributionId], references: [id])
  reviewer        User         @relation(fields: [reviewerId], references: [id])
  ratedUser       User         @relation("RatedReviews", fields: [reviewerId], references: [id])

  @@unique([contributionId, reviewerId])
  @@index([contributionId])
  @@index([reviewerId])
}

model ProvinceStats {
  id                      String   @id @default(cuid())
  provinceId              String   @unique
  contributionCount       Int      @default(0)
  contributorCount        Int      @default(0)
  totalPoints             Int      @default(0)
  isUnderrepresented      Boolean  @default(false)
  lastUpdatedAt           DateTime @default(now())

  province                Province @relation(fields: [provinceId], references: [id])

  @@index([isUnderrepresented])
}

model StreakHistory {
  id              String   @id @default(cuid())
  userId          String
  streakType      StreakType
  startDate       DateTime
  endDate         DateTime?
  length          Int      // Days
  bonusAwarded    Int
  createdAt       DateTime @default(now())

  @@index([userId])
  @@index([streakType])
}

model LeaderboardSnapshot {
  id              String   @id @default(cuid())
  category        LeaderboardCategory
  period          String   // "2026-01", "week-3", etc.
  rankings        Json     // Array of {userId, rank, score, name}
  snapshotAt      DateTime @default(now())

  @@index([category, period])
}

// Enums
enum TransactionType {
  CONTRIBUTION_TEXT
  CONTRIBUTION_AUDIO
  CONTRIBUTION_IMAGE
  CONTRIBUTION_SYNTHETIC
  QUALITY_MULTIPLIER
  FEATURED_BONUS
  PROVINCE_FIRST
  PROVINCE_UNDERREPRESENTED
  MILESTONE_BRONZE
  MILESTONE_SILVER
  MILESTONE_GOLD
  MILESTONE_PLATINUM
  MILESTONE_DIAMOND
  MILESTONE_LEGEND
  STREAK_DAILY
  STREAK_WEEKLY
  STREAK_MONTHLY
  STREAK_YEARLY
  REVIEW_ACTIVITY
  REFERRAL_SIGNUP
  REFERRAL_FIRST_CONTRIBUTION
  PENALTY_SPAM
  PENALTY_DUPLICATE
  PENALTY_LOW_QUALITY
  ADMIN_ADJUSTMENT
}

enum BadgeType {
  MILESTONE
  STREAK
  GEOGRAPHIC
  QUALITY
  SPECIAL
}

enum StreakType {
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
}

enum LeaderboardCategory {
  TOTAL_POINTS
  QUALITY_AVERAGE
  GEOGRAPHIC_COVERAGE
  CONTRIBUTION_COUNT
  REVIEWER_ACTIVITY
  RISING_STAR
}
```

### 1.3 API Endpoints Required

#### Point Management
```
GET    /api/points/leaderboard          - Get leaderboard rankings
GET    /api/points/user/:userId         - Get user point summary
GET    /api/points/history             - Get point transaction history
GET    /api/points/statistics          - Get platform-wide statistics
POST   /api/points/calculate           - Trigger point recalculation (admin)
```

#### Quality & Reviews
```
POST   /api/reviews/rate               - Submit quality rating (1-5 stars)
GET    /api/reviews/pending            - Get pending reviews for reviewers
POST   /api/reviews/approve            - Approve contribution
POST   /api/reviews/reject             - Reject contribution
GET    /api/contributions/:id/ratings  - Get ratings for a contribution
```

#### Achievements & Milestones
```
GET    /api/achievements/user          - Get user achievements
GET    /api/achievements/available     - Get available achievements
POST   /api/achievements/check         - Check for new achievements (triggered)
GET    /api/badges                     - Get all badge definitions
```

#### Streaks & Activity
```
GET    /api/streaks/current            - Get current streak info
GET    /api/streaks/history            - Get streak history
POST   /api/streaks/check              - Check/update streak status
```

#### Geographic
```
GET    /api/provinces/stats            - Get statistics by province
GET    /api/provinces/underrepresented - Get underrepresented provinces
GET    /api/provinces/coverage         - Get user's province coverage
```

#### Admin
```
POST   /api/admin/points/adjust        - Manual point adjustment
POST   /api/admin/points/penalty       - Apply penalty
GET    /api/admin/points/audit         - Audit point transactions
POST   /api/admin/achievements/grant   - Grant achievement manually
GET    /api/admin/analytics            - Platform analytics
```

### 1.4 Frontend Components

#### User-Facing Components
```
/components/points/
  ├── PointDisplay.tsx           - Show current points
  ├── PointHistory.tsx           - Transaction history
  ├── LevelBadge.tsx             - Display user level/badge
  ├── StreakDisplay.tsx          - Current streak counter
  ├── AchievementBadge.tsx       - Individual achievement
  ├── AchievementGrid.tsx        - All achievements grid
  ├── ProvinceCoverage.tsx       - Map/list of provinces contributed
  └── QualityRating.tsx          - Star rating component

/components/leaderboard/
  ├── LeaderboardTable.tsx       - Main leaderboard
  ├── LeaderboardFilters.tsx     - Category filters
  ├── UserRankCard.tsx           - User's ranking card
  └── TopContributors.tsx        - Top contributors list

/components/dashboard/
  ├── PointOverview.tsx          - Dashboard point summary
  ├── RecentEarnings.tsx         - Recent point transactions
  ├── ProgressMilestones.tsx     - Next milestone progress
  └── ActivityCalendar.tsx       - Contribution calendar

/app/
  ├── /dashboard                 - User dashboard with points
  ├── /leaderboard               - Leaderboard page
  ├── /achievements              - Achievements page
  ├── /profile/[userId]          - Public profile with points
  └── /admin/points              - Admin point management
```

#### Admin Components
```
/components/admin/
  ├── PointAdjustment.tsx        - Manual adjustment form
  ├── TransactionAudit.tsx       - Audit log viewer
  ├── UserPointsOverview.tsx     - Admin point view
  ├── PlatformStats.tsx          - Platform-wide statistics
  └── AntiGamingAlerts.tsx       - Suspicious activity alerts
```

---

## 2. Infrastructure Requirements

### 2.1 Development Environment

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| npm/pnpm | Latest | Package manager |
| Git | Latest | Version control |
| PostgreSQL | 15+ | Database (local via Prisma) |

### 2.2 Production Infrastructure

| Service | Provider (Suggested) | Purpose | Est. Cost |
|---------|---------------------|---------|-----------|
| Hosting | Vercel | Next.js deployment | $20-200/mo |
| Database | Supabase / Neon | PostgreSQL | $25-100/mo |
| File Storage | AWS S3 / Cloudflare R2 | Media files | $10-50/mo |
| CDN | Cloudflare | Asset delivery | $0-20/mo |
| Monitoring | Sentry / Vercel Analytics | Error tracking | $0-50/mo |
| Email | Resend / SendGrid | Notifications | $0-20/mo |

**Total Estimated Infrastructure Cost:** $65-440/month (scales with usage)

### 2.3 Environment Variables

```bash
# Existing
DATABASE_URL="..."
GLM_API_KEY="..."

# New Required Variables
NEXTAUTH_SECRET="..."                    # Already needed
NEXTAUTH_URL="..."

# Point System Configuration
POINT_SYSTEM_ENABLED="true"              # Feature flag
LEADERBOARD_CACHE_TTL="300"              # Seconds
STRICT_MODE="false"                      # Enable strict anti-gaming
MIN_APPROVAL_RATE="0.5"                  # Threshold for limits
MAX_DAILY_SUBMISSIONS="50"               # Per user
PROVINCE_UNDERREPRESENTED_PERCENTILE="0.2" # Bottom 20%

# Notification Settings
NOTIFICATION_ENABLED="true"
EMAIL_FROM="noreply@pabuk.ai"

# Rate Limiting
RATE_LIMIT_TTL="900"                     # 15 minutes
RATE_LIMIT_MAX="100"                     # Requests per window

# Analytics (Optional)
ANALYTICS_ENABLED="false"
MIXPANEL_TOKEN="..."
```

### 2.4 Third-Party Services

| Service | Purpose | Required? |
|---------|---------|-----------|
| Sentry | Error tracking | Recommended |
| Resend | Transactional emails | Optional |
| Cloudflare | DDoS protection, CDN | Recommended |
| Mixpanel/Amplitude | User analytics | Optional |
| Upstash Redis | Rate limiting, caching | Optional (use Vercel KV) |

---

## 3. Team Requirements

### 3.1 Team Composition

#### Minimum Viable Team
| Role | FTE | Skills | Responsibilities |
|------|-----|--------|------------------|
| Full-Stack Developer | 1-2 | Next.js, Prisma, TypeScript | Core implementation |
| Frontend Developer | 1 | React, Tailwind CSS | UI/UX components |
| Backend Developer | 1 | Node.js, PostgreSQL, API design | Database, business logic |
| Product Manager | 0.5 | Requirements, prioritization | Scope, timeline, coordination |
| UI/UX Designer | 0.25 | Figma, user research | Visual design, badges, achievements |

**Total:** 3.75-4.75 FTE

#### Ideal Team (for faster delivery)
| Role | FTE | Skills |
|------|-----|--------|
| Tech Lead | 1 | Architecture, senior full-stack |
| Full-Stack Developer | 2 | Next.js, Prisma, React |
| Frontend Specialist | 1 | React, animations, charts |
| Backend Specialist | 1 | PostgreSQL, optimization, security |
| Product Manager | 1 | Full-time ownership |
| UI/UX Designer | 0.5 | Ongoing design support |
| QA Engineer | 0.5 | Testing, automation |
| DevOps Engineer | 0.25 | CI/CD, infrastructure |

**Total:** 7.25 FTE

### 3.2 Required Skills

#### Must-Have Skills
- **TypeScript** (advanced types, generics)
- **Next.js 16** (App Router, Server Actions, RSC)
- **Prisma ORM** (schema design, migrations, raw SQL when needed)
- **React 19** (hooks, state management, performance)
- **PostgreSQL** (indexes, constraints, optimization)
- **Tailwind CSS** (responsive design, custom components)

#### Nice-to-Have Skills
- **NextAuth.js** (authentication, sessions)
- **Redis/Upstash** (caching, rate limiting)
- **Serverless** (Vercel, edge functions)
- **Testing** (Jest, Playwright, Vitest)
- **Analytics** (product analytics, A/B testing)

### 3.3 Development Timeline

**Assumptions:**
- Minimum viable team (3.75 FTE)
- 5-day sprint, 2-week iterations
- No external dependencies/blockers
- Focus on MVP first, iterations later

#### Estimated Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Foundation** | 2 weeks | Database schema, base point calculation |
| **Phase 2: Core Points** | 3 weeks | Point tracking, display, transactions |
| **Phase 3: Quality System** | 2 weeks | Rating system, multipliers |
| **Phase 4: Achievements** | 2 weeks | Milestones, badges, streaks |
| **Phase 5: Geographic** | 1 week | Province tracking, bonuses |
| **Phase 6: Leaderboard** | 2 weeks | Rankings, filtering, caching |
| **Phase 7: Anti-Gaming** | 2 weeks | Rate limiting, detection, penalties |
| **Phase 8: Polish** | 2 weeks | Testing, optimization, bug fixes |
| **Phase 9: Launch Prep** | 1 week | Documentation, monitoring, deployment |

**Total: 17 weeks (4 months)**

With ideal team (7.25 FTE): **10-12 weeks (2.5-3 months)**

---

## 4. Development Phases (Detailed)

### Phase 1: Foundation (Week 1-2)

**Goal:** Set up database and core infrastructure

#### Tasks
- [ ] Update Prisma schema with point-related models
- [ ] Run database migrations
- [ ] Set up environment variables
- [ ] Create base API route structure
- [ ] Implement PointCalculator utility class
- [ ] Write unit tests for point calculations
- [ ] Set up testing database fixtures
- [ ] Create documentation for API contracts

#### Deliverables
- ✅ Updated `schema.prisma`
- ✅ Migration files
- ✅ Base API structure
- ✅ Point calculation engine (testable)

#### Definition of Done
- All new models created and tested
- Point calculations match POINT_SYSTEM_DESIGN.md spec
- Unit tests passing with 80%+ coverage
- Documentation complete

---

### Phase 2: Core Point System (Week 3-5)

**Goal:** Track and display points for contributions

#### Tasks
- [ ] Implement `createContribution()` with point calculation
- [ ] Create PointTransaction records
- [ ] Update User point aggregates
- [ ] Build PointDisplay component
- [ ] Create user point history API
- [ ] Add point breakdown to contribution detail view
- [ ] Implement point recalculation trigger (admin)
- [ ] Write integration tests

#### Deliverables
- ✅ Points automatically awarded on contribution
- ✅ Point history visible to users
- ✅ Admin recalculation tool

#### Definition of Done
- Points calculated correctly for all 11 data types
- Transaction history accurate and queryable
- UI displays points correctly
- Admin can manually adjust points
- All tests passing

---

### Phase 3: Quality & Review System (Week 6-7)

**Goal:** Implement quality ratings and multipliers

#### Tasks
- [ ] Create QualityReview model and API
- [ ] Build rating submission UI (1-5 stars)
- [ ] Implement quality multipliers in PointCalculator
- [ ] Add reviewer validation (only top 25%)
- [ ] Create featured content selection workflow
- [ ] Update point calculations with quality bonuses
- [ ] Add quality feedback notifications
- [ ] Build reviewer dashboard

#### Deliverables
- ✅ Quality rating system functional
- ✅ Multipliers applied correctly
- ✅ Featured content workflow
- ✅ Reviewer tools

#### Definition of Done
- Approved contributions can be rated 1-5 stars
- Points updated based on quality rating
- Featured content gets 2x multiplier
- Only qualified users can review
- Reviewer accuracy tracked

---

### Phase 4: Achievements & Milestones (Week 8-9)

**Goal:** Track and award achievements

#### Tasks
- [ ] Implement achievement checking logic
- [ ] Create Achievement model and API
- [ ] Build achievement checking cron/background job
- [ ] Design badge components (Bronze → Legend)
- [ ] Implement milestone rewards (10, 50, 100... contributions)
- [ ] Add diversity badges (Multi-Talented, Polymath)
- [ ] Create achievement notification system
- [ ] Build achievement grid UI

#### Deliverables
- ✅ Achievements auto-detected and awarded
- ✅ Badge UI components
- ✅ Achievement notifications
- ✅ User achievement profile

#### Definition of Done
- All 15+ milestones from design implemented
- Badges display correctly on profiles
- Achievement triggers fire automatically
- Notification system working
- Edge cases handled (achievement already earned, etc.)

---

### Phase 5: Geographic Tracking (Week 10)

**Goal:** Province coverage and regional bonuses

#### Tasks
- [ ] Create ProvinceStats model
- [ ] Implement province coverage tracking
- [ ] Calculate underrepresented provinces (bottom 20%)
- [ ] Add province bonus logic to PointCalculator
- [ ] Build province coverage map/UI
- [ ] Implement regional completion tracking
- [ ] Add regional bonus rewards
- [ ] Create province statistics dashboard

#### Deliverables
- ✅ Province coverage tracked per user
- ✅ Geographic bonuses awarded
- ✅ Province statistics visible
- ✅ Regional completion system

#### Definition of Done
- First contribution in province = +20pts
- Underrepresented province bonus = +50pts
- Province coverage map functional
- Regional completion rewards working
- Admin can view province stats

---

### Phase 6: Leaderboards (Week 11-12)

**Goal:** Real-time rankings across multiple categories

#### Tasks
- [ ] Design LeaderboardSnapshot schema
- [ ] Implement leaderboard calculation logic
- [ ] Create caching strategy (Redis/Vercel KV)
- [ ] Build leaderboard API (with filters)
- [ ] Create LeaderboardTable component
- [ ] Implement category switching (Total, Quality, Geographic, etc.)
- [ ] Add time period filters (All-time, Monthly, Weekly)
- [ ] Create "Rising Star" leaderboard logic
- [ ] Optimize queries with proper indexes
- [ ] Set up leaderboard refresh cron (daily/weekly)

#### Deliverables
- ✅ 5-6 leaderboard categories
- ✅ Time period filtering
- ✅ Cached, fast leaderboard queries
- ✅ Responsive leaderboard UI
- ✅ Leaderboard snapshots for history

#### Definition of Done
- Leaderboards load <500ms
- Multiple categories work correctly
- Time filters functional
- Cache invalidation working
- Mobile-responsive design
- Pagination for 1000+ users

---

### Phase 7: Anti-Gaming & Abuse Prevention (Week 13-14)

**Goal:** Prevent gaming, spam, and abuse

#### Tasks
- [ ] Implement rate limiting (Vercel KV or Redis)
- [ ] Create duplicate detection algorithm
  - [ ] Text: Similarity check (Levenshtein or cosine)
  - [ ] Audio: Fingerprinting (optional)
  - [ ] Image: Perceptual hash (optional)
- [ ] Build quality threshold system
- [ ] Implement approval rate tracking
- [ ] Create penalty system
- [ ] Add suspicious activity alerts
- [ ] Build admin anti-gaming dashboard
- [ ] Implement account verification tiers
- [ ] Add device fingerprinting (optional)

#### Deliverables
- ✅ Rate limiting enforced
- ✅ Duplicate detection functional
- ✅ Penalty system working
- ✅ Admin alerts configured
- ✅ Abuse prevention dashboard

#### Definition of Done
- Max 50 submissions/day per user
- Duplicates rejected automatically
- Low-quality users flagged
- Penalties applied correctly
- Admin can review suspicious activity
- Appeals process documented

---

### Phase 8: Polish & Optimization (Week 15-16)

**Goal:** Performance, UX, and bug fixes

#### Tasks
- [ ] Performance audit (Lighthouse, WebPageTest)
- [ ] Optimize database queries (EXPLAIN ANALYZE)
- [ ] Add database indexes where needed
- [ ] Implement aggressive caching
- [ ] Load testing (1000 concurrent users)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile responsiveness review
- [ ] SEO optimization for public profiles
- [ ] Error handling and edge cases
- [ ] Comprehensive QA testing
- [ ] Bug fixes and refinements

#### Deliverables
- ✅ Performance budgets met
- ✅ Mobile-optimized
- ✅ Accessible (WCAG AA)
- ✅ Load-tested
- ✅ Bug-free

#### Performance Targets
- Leaderboard load: <500ms
- Point calculation: <200ms
- User dashboard: <1s
- Contribution submission: <500ms
- Lighthouse score: 90+

---

### Phase 9: Launch Preparation (Week 17)

**Goal:** Deploy, monitor, and document

#### Tasks
- [ ] Set up production monitoring (Sentry)
- [ ] Configure error alerts
- [ ] Create admin analytics dashboard
- [ ] Write deployment documentation
- [ ] Create user guide for point system
- [ ] Set up A/B testing framework
- [ ] Configure backup strategy
- [ ] Run final QA checklist
- [ ] Staged rollout (10% → 50% → 100%)
- [ ] Monitor launch metrics

#### Deliverables
- ✅ Production deployment
- ✅ Monitoring configured
- ✅ Documentation complete
- ✅ User guides ready
- ✅ Support runbooks created

#### Launch Checklist
- [ ] Database backed up
- [ ] Rollback plan tested
- [ ] Monitoring alerts configured
- [ ] On-call rotation established
- [ ] User support documentation ready
- [ ] Marketing materials prepared
- [ ] Beta user group identified

---

## 5. Kickoff Preparation Checklist

### 5.1 Before Development Starts

#### Technical Setup ✅
- [ ] Repository access and permissions configured
- [ ] Development environment documented (README)
- [ ] Database instance provisioned (local + staging)
- [ ] Environment variables template created
- [ ] CI/CD pipeline configured (GitHub Actions)
- [ ] Code review guidelines established
- [ ] Git workflow agreed upon (GitFlow, trunk-based, etc.)

#### Team Alignment
- [ ] Point system design reviewed and approved
- [ ] Roles and responsibilities assigned
- [ ] Communication channels set up (Discord/Slack)
- [ ] Project management tool configured (Linear/Jira)
- [ ] Sprint schedule agreed upon (standups, retros)
- [ ] Decision-making framework defined

#### Documentation
- [ ] POINT_SYSTEM_DESIGN.md reviewed by all
- [ ] API contracts documented (OpenAPI/Markdown)
- [ ] Database diagram created (dbdiagram.io)
- [ ] Component architecture documented
- [ ] Testing strategy defined
- [ ] Deployment checklist created

#### External Dependencies
- [ ] Vercel team account and access
- [ ] Database hosting selected and provisioned
- [ ] Sentry account configured
- [ ] Email service (Resend/SendGrid) set up
- [ ] Domain and SSL configured
- [ ] Analytics tool selected (Mixpanel/Amplitude/Google Analytics)

### 5.2 Week 1 Priorities

**Day 1-2: Setup & Alignment**
- Full team kickoff meeting
- Development environment validation
- Database schema final review
- Set up staging environment

**Day 3-5: Initial Implementation**
- Create Git branches
- Implement first database migration
- Set up PointCalculator skeleton
- Create initial API routes
- First working point calculation

**End of Week 1:**
- Demo: Basic point calculation working
- Retro: What worked, what didn't
- Plan Week 2 tasks

---

## 6. Risk Assessment & Mitigation

### 6.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Database performance issues with scale | Medium | High | Proper indexing, caching, read replicas |
| Point calculation bugs | High | High | Comprehensive tests, code review, recalculation tools |
| Abuse/gaming of system | High | High | Anti-gaming measures, rate limiting, monitoring |
| Leaderboard performance at scale | Medium | Medium | Caching, snapshots, denormalized tables |
| Migration downtime | Low | Medium | Zero-downtime migration strategy |
| Third-party API failures | Low | Medium | Fallbacks, retries, circuit breakers |

### 6.2 Product Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Point values don't motivate users | Medium | High | A/B testing, user surveys, iteration |
| System too complex to understand | Medium | Medium | UX research, progressive disclosure, tooltips |
| Geographic imbalance persists | Low | Medium | Dynamic bonuses, targeted campaigns |
| Quality rating inconsistency | High | Medium | Reviewer calibration, consensus system |
| Contributors game milestones | Medium | Medium | Anti-gaming, validation, minimum quality thresholds |

### 6.3 Team Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Key developer dependency | Medium | High | Documentation, pair programming, knowledge sharing |
| Scope creep | High | Medium | Strict MVP definition, phase boundaries |
| Timeline overruns | Medium | Medium | Buffer time, regular retros, prioritization |
| Technical debt accumulation | High | Medium | Code review, refactoring sprints, quality gates |

---

## 7. Testing Strategy

### 7.1 Testing Pyramid

```
        /\
       /  \        E2E Tests (10%)
      /____\       - Critical user flows
     /      \      - Leaderboard, point calculation
    /        \     - Submission to approval flow
   /          \
  /            \   Integration Tests (30%)
 /______________\  - API endpoints
                  - Database operations
                  - Point calculations
                  - Quality ratings
 /                \
/                  \ Unit Tests (60%)
- PointCalculator logic
- Utility functions
- Component rendering
- Validators
```

### 7.2 Critical Test Scenarios

#### Point Calculation Tests
```typescript
describe('PointCalculator', () => {
  // Base points
  test('calculates correct base points for each data type')
  test('handles all 11 categories correctly')

  // Quality multipliers
  test('applies correct multipliers for PENDING/APPROVED/FEATURED')
  test('calculates quality bonus (1-5 stars)')

  // Geographic bonuses
  test('awards first province bonus')
  test('identifies underrepresented provinces')
  test('applies regional completion bonus')

  // Milestones
  test('awards one-time milestone bonuses')
  test('does not award milestone twice')

  // Streaks
  test('calculates daily streak correctly')
  test('resets streak after 48 hours')

  // Edge cases
  test('handles deletion of contributions')
  test('recalculates on status change')
  test('applies penalties correctly')
})
```

#### Integration Tests
```typescript
describe('Point System Integration', () => {
  test('end-to-end contribution flow')
  test('quality rating updates points')
  test('achievement triggers after milestone')
  test('leaderboard updates correctly')
  test('rate limiting enforced')
  test('duplicate detection works')
})
```

#### E2E Tests (Playwright)
```typescript
describe('User Flows', () => {
  test('user submits contribution, sees points')
  test('user views point history')
  test('leaderboard displays correctly')
  test('achievement earned and shown')
  test('streak counter updates')
})
```

### 7.3 Performance Testing

- **Load Testing:** 1000 concurrent users
- **Stress Testing:** Peak load simulation (10,000 req/min)
- **Database Performance:** EXPLAIN ANALYZE on all queries
- **Cache Effectiveness:** Hit rate monitoring

### 7.4 A/B Testing Plan

| Test | Variable | Metric | Duration |
|------|----------|--------|----------|
| Point values | Base points for low-volume types | Submission volume | 4 weeks |
| Featured multiplier | 2x vs 3x | Quality improvement | 2 weeks |
| Streak bonuses | Current vs doubled | Retention | 4 weeks |
| Geographic bonus | +20 vs +50 | Province coverage | 8 weeks |

---

## 8. Monitoring & Analytics

### 8.1 Key Metrics to Track

#### Business Metrics
- Daily active contributors
- Contribution submission rate
- Approval rate
- Average quality rating
- Geographic coverage (provinces)
- Point distribution (mean, median, P99)

#### Technical Metrics
- API response times (p50, p95, p99)
- Database query performance
- Cache hit rates
- Error rates (4xx, 5xx)
- Rate limiting blocks
- Duplicate detection rate

#### User Engagement
- Dashboard page views
- Leaderboard visits
- Achievement unlocks
- Streak maintenance rate
- Referral conversion rate

### 8.2 Monitoring Setup

#### Production Monitoring
```javascript
// Metrics to track with Sentry/Vercel Analytics
{
  "points_calculated": "counter",
  "achievement_unlocked": "counter",
  "leaderboard_view": "counter",
  "quality_rating_given": "counter",
  "submission_rejected": "counter",
  "duplicate_detected": "counter",
  "point_calculation_duration": "histogram",
  "leaderboard_load_duration": "histogram"
}
```

#### Alerts Configuration
- Point calculation errors > 5/min
- API error rate > 1%
- Database query time > 1s
- Leaderboard cache miss rate > 50%
- Suspicious activity spikes

### 8.3 Analytics Queries

```sql
-- Daily contribution trends
SELECT DATE(createdAt), COUNT(*), AVG(pointsAwarded)
FROM Contribution
GROUP BY DATE(createdAt)
ORDER BY DATE DESC;

-- Quality distribution
SELECT qualityRating, COUNT(*)
FROM Contribution
WHERE qualityRating IS NOT NULL
GROUP BY qualityRating;

-- Geographic coverage
SELECT p.nameEn, COUNT(*) as total, COUNT(DISTINCT c.userId) as contributors
FROM Contribution c
JOIN Province p ON c.provinceId = p.id
GROUP BY p.id, p.nameEn
ORDER BY total DESC;

-- Top contributors (with quality threshold)
SELECT u.name, SUM(c.pointsAwarded) as totalPoints,
       AVG(c.qualityRating) as avgRating,
       COUNT(*) as contributions
FROM User u
JOIN Contribution c ON c.userId = u.id
WHERE c.status = 'APPROVED'
GROUP BY u.id
HAVING AVG(c.qualityRating) >= 3
ORDER BY totalPoints DESC
LIMIT 100;

-- Point distribution
SELECT
  NTILE(100) OVER (ORDER BY points) as percentile,
  points
FROM User
ORDER BY percentile;
```

---

## 9. Budget Estimation

### 9.1 Development Cost

| Role | FTE | Duration | Monthly Cost | Total Cost |
|------|-----|----------|--------------|------------|
| Full-Stack Developer | 2 | 4 months | $10,000 | $40,000 |
| Frontend Developer | 1 | 2 months | $8,000 | $16,000 |
| Backend Developer | 1 | 2 months | $8,000 | $16,000 |
| Product Manager | 0.5 | 4 months | $7,000 | $28,000 |
| UI/UX Designer | 0.25 | 4 months | $3,000 | $12,000 |
| QA Engineer | 0.5 | 1 month | $6,000 | $6,000 |

**Total Development Cost:** $118,000 (minimum viable team)
**With Ideal Team:** $180,000-$220,000

### 9.2 Infrastructure Cost (Year 1)

| Service | Monthly | Annual |
|---------|---------|--------|
| Vercel (Pro) | $20 | $240 |
| Database (Supabase) | $25 | $300 |
| Object Storage (S3/R2) | $10 | $120 |
| CDN (Cloudflare) | $0 | $0 |
| Monitoring (Sentry) | $0 | $0 |
| Email (Resend) | $0 | $0 |
| **Total (MVP)** | **$55** | **$660** |

**Scale-up Costs** (10k users, 100k contributions):
- Vercel: $200/mo
- Database: $100/mo
- Storage: $50/mo
- **Total:** $350/mo = $4,200/year

### 9.3 Ongoing Maintenance

| Activity | Frequency | Cost |
|----------|-----------|------|
| Bug fixes | Ongoing | 0.5 FTE |
| Feature iterations | Quarterly | 1 FTE |
| Monitoring & support | Ongoing | 0.25 FTE |
| Analytics & optimization | Monthly | 0.25 FTE |

**Annual Maintenance:** 2 FTE = $96,000/year

---

## 10. Success Criteria

### 10.1 Launch Criteria (MVP)

- [ ] All 7 phases complete
- [ ] 90%+ test coverage on point calculations
- [ ] Performance budgets met (Lighthouse 90+)
- [ ] Zero critical bugs
- [ ] Documentation complete
- [ ] Beta group tested (50+ users)
- [ ] Load tested (1000 concurrent)
- [ ] Security audit passed

### 10.3 Success Metrics (3 Months Post-Launch)

| Metric | Target |
|--------|--------|
| DAU (Daily Active Users) | 500+ |
| Contribution rate | 50+ per day |
| Average quality rating | 3.5+ stars |
| Geographic coverage | 50+ provinces |
| User retention (30-day) | 40%+ |
| Point system satisfaction | 4.0+/5.0 |
| Abuse rate | <1% of submissions |

### 10.3 Long-term Goals (12 Months)

| Metric | Target |
|--------|--------|
| Total contributions | 50,000+ |
| Active contributors | 5,000+ |
| Provinces covered | 77/77 (100%) |
| Average quality rating | 4.0+ stars |
| Monthly active users | 5,000+ |
| Community satisfaction | 4.5+/5.0 |

---

## 11. Post-Launch Roadmap

### Quarter 1 (Post-Launch)
- Monitor and iterate on point values
- Fix critical bugs
- Optimize performance
- Gather user feedback

### Quarter 2
- Add advanced achievements
- Implement seasonal events
- Launch referral program
- A/B test point multipliers

### Quarter 3
- Team contribution features
- Integration with GLM AI
- Advanced analytics dashboard
- Mobile app (React Native)

### Quarter 4
- Marketplace/redemption (optional)
- API for third-party integrations
- Ambassador program
- Monetization experiments

---

## 12. Dependencies & Blockers

### External Dependencies
- [ ] GLM API for AI features (already configured)
- [ ] Vercel account for deployment
- [ ] Database hosting selected
- [ ] Email service for notifications

### Internal Dependencies
- [ ] User authentication working (NextAuth)
- [ ] Contribution submission flow stable
- [ ] Province data seeded (77 provinces)
- [ ] Review workflow functional

### Potential Blockers
- **Database schema changes** - May require migration downtime
- **Point calculation bugs** - Hard to fix post-launch
- **Performance issues** - May require architectural changes
- **Abuse vectors** - Could damage platform trust

### Mitigation
- Comprehensive testing before launch
- Feature flags for gradual rollout
- Point recalculation tools
- Monitoring and quick response team

---

## 13. Decision Log

### Decisions Needed Before Development

1. **Point Values Final Approval**
   - Stakeholder: Product Manager
   - Due: Week 0
   - Impact: Core system design

2. **Database Hosting Provider**
   - Stakeholder: Tech Lead
   - Due: Week 0
   - Impact: Performance, cost

3. **MVP Feature Scope**
   - Stakeholder: Product Manager
   - Due: Week 0
   - Impact: Timeline, budget

4. **Anti-Gaming Strictness**
   - Stakeholder: Product, Trust & Safety
   - Due: Week 1
   - Impact: User experience vs. abuse prevention

5. **Leaderboard Refresh Frequency**
   - Stakeholder: Engineering, Product
   - Due: Week 2
   - Impact: Performance, user engagement

---

## 14. Glossary

| Term | Definition |
|------|------------|
| **Base Points** | Initial points awarded for a contribution type |
| **Quality Multiplier** | Points modifier based on 1-5 star rating |
| **Streak** | Consecutive days/weeks with approved contributions |
| **Underrepresented Province** | Bottom 20% of provinces by contribution count |
| **Featured Content** | Exceptional contributions selected by reviewers |
| **Achievement** | Badge/milestone awarded for meeting criteria |
| **Leaderboard** | Ranking of users by points, quality, or other metrics |
| **FTE** | Full-Time Equivalent (1.0 = 40 hours/week) |
| **DAU** | Daily Active Users |
| **MAU** | Monthly Active Users |

---

## 15. Appendix

### A. Point Calculation Formula

```
Total Points = (Base Points × Status Multiplier × Quality Multiplier)
               + Quality Bonus
               + Geographic Bonus
               + Milestone Bonus
               + Streak Bonus

Where:
- Base Points: From data type category table
- Status Multiplier: PENDING=0.5, APPROVED=1.0, FEATURED=2.0
- Quality Multiplier: 1 star=0.8x, 5 stars=1.5x
- Quality Bonus: 1 star=-10, 5 stars=+50
- Geographic Bonus: First in province=+20, Underrepresented=+50
- Milestone Bonus: One-time (e.g., 100 contributions=+1000)
- Streak Bonus: Daily=+10, Week warrior=+100, etc.
```

### B. Database Migration Script Template

```sql
-- Migration: Add point system fields
-- Date: 2026-01-19

-- Add fields to User table
ALTER TABLE "User" ADD COLUMN "points" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "level" VARCHAR(50) NOT NULL DEFAULT 'Bronze';
ALTER TABLE "User" ADD COLUMN "streak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "totalContributions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "approvedContributions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "provincesCovered" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "averageQualityRating" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Add fields to Contribution table
ALTER TABLE "Contribution" ADD COLUMN "pointsAwarded" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Contribution" ADD COLUMN "qualityRating" INTEGER;
ALTER TABLE "Contribution" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE "Contribution" ADD COLUMN "featuredAt" TIMESTAMP;
ALTER TABLE "Contribution" ADD COLUMN "reviewerIds" TEXT[];
ALTER TABLE "Contribution" ADD COLUMN "calculatedAt" TIMESTAMP;

-- Create indexes for performance
CREATE INDEX "User_points_idx" ON "User"("points" DESC);
CREATE INDEX "Contribution_pointsAwarded_idx" ON "Contribution"("pointsAwarded" DESC);
CREATE INDEX "Contribution_qualityRating_idx" ON "Contribution"("qualityRating");
CREATE INDEX "Contribution_isFeatured_idx" ON "Contribution"("isFeatured");

-- Create new tables
-- (Full CREATE TABLE statements for PointTransaction, Achievement, etc.)
```

### C. API Response Examples

#### GET /api/points/user/:userId
```json
{
  "success": true,
  "data": {
    "userId": "clx123abc",
    "points": 3450,
    "level": "Gold",
    "rank": 42,
    "stats": {
      "totalContributions": 87,
      "approvedContributions": 82,
      "averageQualityRating": 4.2,
      "provincesCovered": 12,
      "currentStreak": 7
    },
    "breakdown": {
      "contributions": 2800,
      "bonuses": 450,
      "milestones": 200,
      "penalties": 0
    }
  }
}
```

#### GET /api/points/leaderboard?category=TOTAL_POINTS&period=monthly
```json
{
  "success": true,
  "data": {
    "category": "TOTAL_POINTS",
    "period": "monthly",
    "updatedAt": "2026-01-19T12:00:00Z",
    "rankings": [
      {
        "rank": 1,
        "userId": "clx456def",
        "name": "Somchai W.",
        "points": 2450,
        "contributions": 45,
        "level": "Platinum"
      },
      // ... more rankings
    ],
    "currentUser": {
      "rank": 42,
      "points": 890
    }
  }
}
```

---

## Summary

This roadmap provides a comprehensive plan for implementing the Pabuk Contribution Point System:

✅ **17-week development timeline** (4 months) with minimum team
✅ **Clear phase breakdown** with specific deliverables
✅ **Technical requirements** fully specified
✅ **Team composition** defined (3.75-7.25 FTE)
✅ **Infrastructure needs** documented with cost estimates
✅ **Risk mitigation** strategies included
✅ **Testing strategy** defined
✅ **Success criteria** measurable
✅ **Post-launch roadmap** for continued iteration

**Next Steps:**
1. Review and approve this roadmap
2. Finalize team and budget
3. Set up infrastructure
4. Kick off Phase 1!

---

**Document Version:** 1.0
**Author:** Claude (AI Assistant)
**Last Updated:** January 19, 2026
**Status:** Ready for Review
