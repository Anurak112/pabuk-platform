# Pabuk Contribution Point System Design

## Overview

This document defines the comprehensive point system for rewarding contributors to the Pabuk cultural data platform. The system is designed to incentivize quality contributions, geographic diversity, and community engagement.

**Core Principles:**
- Quality > Quantity
- Encourage diverse contribution types
- Reward geographic coverage across all 77 provinces
- Recognize long-term commitment
- Prevent gaming and abuse

---

## 1. Base Points by Data Type

### Primary Content Contributions

| Data Type | Category | Base Points | Rationale |
|-----------|----------|-------------|-----------|
| **TEXT** | Folktales | 50 points | Requires research and storytelling |
| **TEXT** | Proverbs | 30 points | Shorter, but requires cultural knowledge |
| **TEXT** | Local History | 60 points | High cultural value, requires documentation |
| **AUDIO** | Dialects | 80 points | Rare, disappearing heritage, hard to capture |
| **AUDIO** | Folk Songs | 70 points | Performance skill required |
| **AUDIO** | Festival Sounds | 60 points | Event-specific, timing-dependent |
| **IMAGE** | Landmarks | 40 points | Photography skill, location-dependent |
| **IMAGE** | Landscapes | 35 points | Travel required |
| **IMAGE** | Cultural Objects | 50 points | Access and photography skills |
| **IMAGE** | Food | 45 points | Cultural significance + presentation |
| **SYNTHETIC** | AI Content | 20 points | Lower barrier, used for AI training |

**Minimum Viable Contribution:**
- Text: Minimum 100 characters (Thai or English)
- Audio: Minimum 10 seconds, clear quality
- Image: Minimum 800x600 resolution, clear subject
- Synthetic: Must include source prompt and model used

---

## 2. Quality Multipliers

### Approval Status Multipliers

| Status | Multiplier | Description |
|--------|-----------|-------------|
| **PENDING** | 0.5x | Points awarded provisionally |
| **APPROVED** | 1.0x | Full points awarded |
| **FEATURED** | 2.0x | Selected as exemplary content |

### Quality Rating by Reviewers

Reviewers can rate approved content on a scale of 1-5 stars:

| Rating | Multiplier | Additional Points |
|--------|-----------|-------------------|
| ⭐ 1 star | 0.8x | -10 points (poor quality) |
| ⭐⭐ 2 stars | 0.9x | 0 points (below average) |
| ⭐⭐⭐ 3 stars | 1.0x | +10 points (average) |
| ⭐⭐⭐⭐ 4 stars | 1.2x | +25 points (good quality) |
| ⭐⭐⭐⭐⭐ 5 stars | 1.5x | +50 points (exceptional) |

**Reviewer Requirements:**
- Must be APPROVED to receive quality rating
- Only top 25% contributors can become reviewers
- Minimum 50 approved contributions required
- Consensus from 2+ reviewers required for 5-star

---

## 3. Geographic Bonuses

### Province Coverage

Thailand has 77 provinces across 6 regions. Rewards for geographic diversity:

| Achievement | Points | One-time or Per Province |
|-------------|--------|--------------------------|
| First contribution in any province | +20 | One-time per province |
| Complete 10 provinces | +500 | One-time milestone |
| Complete 25 provinces | +1,500 | One-time milestone |
| Complete 50 provinces | +3,000 | One-time milestone |
| Complete all 77 provinces | +10,000 | One-time (Prestige Badge) |
| First contribution in UNDERREPRESENTED province* | +50 | Per contribution |

*Underrepresented province: Bottom 20% of provinces by total contribution count (recalculated weekly)

### Regional Completion

| Achievement | Points | Description |
|-------------|--------|-------------|
| Complete a Region (all provinces in one region) | +1,000 | Per region |
| Complete All 6 Regions | +5,000 | Ultimate Explorer Badge |

---

## 4. Contribution Milestones

### Quantity Milestones (Cumulative)

| Total Approved Contributions | Badge | Bonus Points |
|------------------------------|-------|--------------|
| 10 | Bronze Contributor | +100 |
| 50 | Silver Contributor | +500 |
| 100 | Gold Contributor | +1,000 |
| 500 | Platinum Contributor | +5,000 |
| 1,000 | Diamond Contributor | +10,000 |
| 5,000 | Master Curator | +50,000 |
| 10,000 | Legend | +100,000 |

### Data Type Diversity Milestones

| Achievement | Requirement | Bonus Points |
|-------------|-------------|--------------|
| Multi-Talented | 10+ contributions in 2 different data types | +200 |
| Polymath | 10+ contributions in all 4 data types | +500 |
| Storyteller | 100 approved text contributions | +300 |
| Sound Archivist | 50 approved audio contributions | +400 |
| Visual Artist | 50 approved image contributions | +350 |
| AI Pioneer | 100 approved synthetic contributions | +200 |

---

## 5. Activity & Consistency Bonuses

### Streak Bonuses

| Streak Type | Requirement | Daily Bonus |
|-------------|-------------|-------------|
| Daily Contributor | 1+ approved contribution per day | +10 points/day |
| Week Warrior | 7-day streak | +100 points |
| Monthly Master | 30-day streak | +500 points |
| Quarterly Champion | 90-day streak | +2,000 points |
| Yearly Legend | 365-day streak | +10,000 points |

*Only APPROVED contributions count toward streaks. Streak resets if no approvals in 48 hours.*

### Weekly Challenges

Special themed challenges to encourage participation:

| Challenge Type | Frequency | Reward |
|----------------|-----------|--------|
| Province Focus | Weekly | +200 bonus for contributions to featured province |
| Data Type Focus | Weekly | +150 bonus for specific data type |
| Quality Quest | Weekly | +300 bonus for maintaining 4+ star average |

---

## 6. Review & Curation Points

Users with REVIEWER or ADMIN role earn points for moderation:

| Activity | Points | Description |
|----------|--------|-------------|
| Review Submission | +5 points | Per review (approve/reject) |
| Quality Rating | +2 points | Per star rating assigned |
| Tag Contributions | +3 points | Per relevant tag added |
| Catch Duplicates | +20 points | Identifying duplicate content |
| Mentorship | +50 points | Helping new contributors (verified) |

**Review Quality Incentives:**
- Top 10% reviewers (by accuracy) receive +500 monthly bonus
- Reviewer accuracy calculated by: % of reviewer approvals that maintain 3+ star average

---

## 7. Referral Program

| Action | Points | Description |
|--------|--------|-------------|
| Referred User Sign-up | +50 points | When new user registers |
| Referred User First Contribution | +100 points | When referral makes first approved contribution |
| Referred User Reaches 50 Contributions | +500 points | Milestone bonus |

*Referral code required. Limit: 100 active referrals per user.*

---

## 8. Leaderboard Rankings

### Monthly Leaderboard Categories

| Category | Top Reward |
|----------|------------|
| Top Contributor (Total Points) | Featured homepage + 5,000 bonus |
| Top Quality Contributor (Highest avg rating) | 3,000 bonus |
| Geographic Explorer (Most provinces) | 2,000 bonus |
| Rising Star (New users, <3 months) | 1,000 bonus |
| Reviewer Champion (Most reviews) | 2,000 bonus |

**Season reset:** Leaderboard points reset monthly, but total points accumulate.

---

## 9. Point Redemption & Recognition (Optional Future)

If the platform implements point redemption:

| Tier | Points Required | Benefits |
|------|-----------------|----------|
| Bronze | 0 - 999 | Basic badge on profile |
| Silver | 1,000 - 4,999 | Silver badge, custom profile border |
| Gold | 5,000 - 19,999 | Gold badge, priority review, early features |
| Platinum | 20,000 - 99,999 | Platinum badge, voting rights on platform decisions |
| Diamond | 100,000+ | Diamond badge, exclusive events, potential revenue share |

**Non-monetary recognition:**
- Contributor of the Month spotlight
- Featured contributions on homepage
- Special badges for unique achievements
- Digital certificates for cultural preservation

---

## 10. Anti-Gaming & Abuse Prevention

### Safeguards

1. **Rate Limiting:**
   - Max 50 submissions per user per day
   - Max 10 submissions per hour

2. **Quality Thresholds:**
   - Users with <50% approval rate have submission limits reduced
   - Repeated low-quality submissions (1-2 stars) result in temporary bans

3. **Duplicate Detection:**
   - Automatic detection of identical or near-identical content
   - Duplicate submissions rejected, no points awarded
   - Repeat offenders receive escalating penalties

4. **Reviewer Validation:**
   - Random sampling of reviewer decisions
   - Reviewers with <70% accuracy lose reviewer status
   - Appeal process for rejected content

5. **Geographic Verification:**
   - IP geolocation to validate province claims
   - Occasional verification requests for content authenticity

6. **Account Verification:**
   - Email verification required before earning points
   - Phone verification for high-tier contributors (5,000+ points)
   - One account per person (device fingerprinting)

### Penalties

| Violation | First Offense | Repeat Offense |
|-----------|---------------|----------------|
| Spam/low-quality submissions | Warning + 50% point deduction | 7-day ban + point reset |
| Fake/AI-generated content (not marked synthetic) | Content removed + 100 point deduction | Permanent ban |
| Multiple accounts | All accounts merged + warning | All accounts banned |
| Review collusion | Reviewer status revoked | Permanent ban |

---

## 11. Point Calculation Examples

### Example 1: High-Quality Dialect Recording
- Base: Dialect audio = 80 points
- Status: Approved (1.0x)
- Quality: 5 stars (1.5x + 50)
- First in province: +20
- **Total: 80 × 1.0 × 1.5 + 50 + 20 = 190 points**

### Example 2: Average Folk Tale Submission
- Base: Folktale text = 50 points
- Status: Approved (1.0x)
- Quality: 3 stars (1.0x + 10)
- 10th contribution (Bronze milestone): +100
- **Total: 50 × 1.0 × 1.0 + 10 + 100 = 160 points**

### Example 3: Underrepresented Province Food Image
- Base: Food image = 45 points
- Status: Approved (1.0x)
- Quality: 4 stars (1.2x + 25)
- Underrepresented province: +50
- Daily streak day 7: +100 (Week Warrior)
- **Total: 45 × 1.0 × 1.2 + 25 + 50 + 100 = 229 points**

---

## 12. Database Schema Recommendations

### New Tables/Fields

```prisma
model User {
  // Existing fields...
  points              Int      @default(0)
  level               String   @default("Bronze")
  referralCode        String?  @unique
  referredBy          String?
  streak              Int      @default(0)
  lastContributionAt  DateTime?
  totalContributions  Int      @default(0)
  approvedContributions Int    @default(0)
  provincesCovered    Int      @default(0)
}

model Contribution {
  // Existing fields...
  pointsAwarded       Int      @default(0)
  qualityRating       Int?     // 1-5 stars
  isFeatured          Boolean  @default(false)
  reviewerIds         String[] // Array of reviewer IDs
}

model PointTransaction {
  id          String   @id
  userId      String
  type        String   // CONTRIBUTION, BONUS, MILESTONE, PENALTY, etc.
  amount      Int
  reason      String
  contributionId String?
  createdAt   DateTime @default(now())
}

model Achievement {
  id          String   @id
  userId      String
  badgeName   String
  badgeType   String   // MILESTONE, STREAK, GEOGRAPHIC, etc.
  earnedAt    DateTime @default(now)
}

model ProvinceStats {
  id          String   @id
  provinceId  String   @unique
  contributionCount Int @default(0)
  contributorCount   Int @default(0)
  lastUpdatedAt DateTime @default(now)
}
```

---

## 13. Implementation Priority

### Phase 1: Core Points System (MVP)
- [ ] Base points for each data type
- [ ] Approval status multipliers
- [ ] Basic point tracking in database
- [ ] Point display on user dashboard

### Phase 2: Quality & Multipliers
- [ ] Quality rating system (1-5 stars)
- [ ] Quality multipliers
- [ ] Featured content selection

### Phase 3: Geographic & Milestones
- [ ] Province coverage tracking
- [ ] Milestone badges and rewards
- [ ] Geographic diversity bonuses

### Phase 4: Advanced Features
- [ ] Streak bonuses
- [ ] Leaderboards
- [ ] Reviewer rewards
- [ ] Referral program

### Phase 5: Anti-Gaming
- [ ] Rate limiting
- [ ] Duplicate detection
- [ ] Quality thresholds
- [ ] Abuse detection and penalties

---

## 14. Monitoring & Analytics

### Key Metrics to Track

1. **Engagement Metrics:**
   - Points distributed per day
   - Active contributors (with 1+ approved contribution)
   - Retention rate by point tier

2. **Quality Metrics:**
   - Average quality rating by user
   - Approval rate by data type
   - Featured content percentage

3. **Geographic Metrics:**
   - Provinces with <10 contributions
   - Regional coverage balance
   - Top contributing provinces

4. **System Health:**
   - Flagged/potential abuse cases
   - Point deduction frequency
   - Appeal request volume

### A/B Testing Recommendations

- Test different base point values for low-volume data types
- Experiment with bonus structures to encourage quality
- Test impact of featured content on overall quality
- Validate optimal streak bonus amounts

---

## 15. Future Considerations

### Potential Enhancements

1. **Team Contributions:**
   - Allow group projects
   - Shared point pools
   - Team leaderboards

2. **Seasonal Events:**
   - Thai New Year (Songkran) special events
   - Loy Krathong festival challenges
   - Regional cultural celebrations

3. **Collaborative Features:**
   - Points for contributing to others' submissions
   - Translation bonuses (Thai ↔ English)
   - Metadata enrichment rewards

4. **Integration Opportunities:**
   - Thai Ministry of Culture partnerships
   - University research collaborations
   - UNESCO cultural heritage projects

---

## Summary

This point system is designed to:

✅ **Incentivize quality** through multipliers and ratings
✅ **Encourage diversity** across data types and geography
✅ **Recognize consistency** through streaks and milestones
✅ **Reward community** through reviews and referrals
✅ **Prevent abuse** through safeguards and penalties
✅ **Scale sustainably** with clear phases for implementation

The system balances accessibility for new contributors while maintaining value for dedicated participants. Regular monitoring and iteration will ensure the point system continues to align with Pabuk's mission of preserving Thailand's cultural heritage.

---

**Document Version:** 1.0
**Last Updated:** January 19, 2026
**Next Review:** After 3 months of implementation or 500 approved contributions
