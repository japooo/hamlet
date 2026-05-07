import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    createdAt: v.number(), // Unix ms
  })
    .index("by_email", ["email"])
    .index("by_clerk_id", ["clerkId"]),

  auditionPreparations: defineTable({
    userId: v.id("users"),
    title: v.string(),
    scriptSource: v.union(v.literal("PDF_UPLOAD"), v.literal("MANUAL_TEXT")),
    pdfFileUrl: v.optional(v.string()),
    selectedCharacter: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  scriptSegments: defineTable({
    preparationId: v.id("auditionPreparations"),
    characterName: v.string(),
    text: v.string(),
    orderIndex: v.number(),
    sceneLabel: v.optional(v.string()),
  }).index("by_preparation", ["preparationId"]),

  practiceSessions: defineTable({
    preparationId: v.id("auditionPreparations"),
    userId: v.id("users"),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    mode: v.union(
      v.literal("FULL_SCENE"),
      v.literal("LINES_ONLY"),
      v.literal("DRILL_WEAK_SPOTS")
    ),
  })
    .index("by_preparation", ["preparationId"])
    .index("by_user", ["userId"]),

  lineAttempts: defineTable({
    practiceSessionId: v.id("practiceSessions"),
    scriptSegmentId: v.id("scriptSegments"),
    attemptNumber: v.number(),
    transcribedText: v.optional(v.string()),
    accuracyScore: v.optional(v.number()), // 0–1
    timingOffsetMs: v.optional(v.number()),
    errorTags: v.optional(
      v.array(
        v.union(
          v.literal("MISSING_WORD"),
          v.literal("EXTRA_WORD"),
          v.literal("PARAPHRASE"),
          v.literal("EMOTION_MISMATCH"),
          v.literal("PAUSE_FILLER")
        )
      )
    ),
  })
    .index("by_session", ["practiceSessionId"])
    .index("by_segment", ["scriptSegmentId"]),

  auditionStateSummaries: defineTable({
    preparationId: v.id("auditionPreparations"),
    practiceSessionId: v.optional(v.id("practiceSessions")),
    generatedAt: v.number(),
    bullets: v.array(v.string()),
    weakSegmentIds: v.array(v.id("scriptSegments")),
    patternSummary: v.optional(v.string()), // JSON blob
  }).index("by_preparation", ["preparationId"]),
});
