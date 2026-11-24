import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const questionType = pgEnum("question_type", ["multiple_choice", "essay"]);

export type QuestionOption = { key: string; text: string };
export type RubricCriterion = { criterio: string; peso: number };

export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const topics = pgTable(
  "topics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
  },
  (t) => [unique().on(t.subjectId, t.slug)],
);

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  topicId: uuid("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  type: questionType("type").notNull(),
  statement: text("statement").notNull(),
  options: jsonb("options").$type<QuestionOption[]>(),
  correctOption: text("correct_option"),
  expectedAnswer: text("expected_answer"),
  rubric: jsonb("rubric").$type<RubricCriterion[]>(),
  exam: text("exam"),
  year: integer("year"),
  source: text("source"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const attempts = pgTable("attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  selectedOption: text("selected_option"),
  answerText: text("answer_text"),
  isCorrect: boolean("is_correct"),
  score: real("score"),
  timeSpentMs: integer("time_spent_ms"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cards = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    due: timestamp("due").notNull(),
    stability: real("stability").notNull(),
    difficulty: real("difficulty").notNull(),
    elapsedDays: integer("elapsed_days").notNull(),
    scheduledDays: integer("scheduled_days").notNull(),
    learningSteps: integer("learning_steps").notNull(),
    reps: integer("reps").notNull(),
    lapses: integer("lapses").notNull(),
    state: smallint("state").notNull(),
    lastReview: timestamp("last_review"),
  },
  (t) => [unique().on(t.userId, t.questionId)],
);

export const reviewLogs = pgTable("review_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardId: uuid("card_id")
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(),
  state: smallint("state").notNull(),
  due: timestamp("due").notNull(),
  stability: real("stability").notNull(),
  difficulty: real("difficulty").notNull(),
  scheduledDays: integer("scheduled_days").notNull(),
  learningSteps: integer("learning_steps").notNull(),
  review: timestamp("review").notNull(),
});
