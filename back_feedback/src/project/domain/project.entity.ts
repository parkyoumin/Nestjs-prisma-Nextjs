import { Feedback } from "src/feedback/domain/feedback.entity";

export class Project {
  readonly id: string;
  readonly title: string;
  readonly userId: bigint;
  readonly createdAt: Date;
  readonly deletedAt?: Date | null;
  readonly feedbackCount?: number;
  readonly feedbacks?: Feedback[];

  constructor(props: {
    id: string;
    title: string;
    userId: bigint;
    createdAt: Date;
    deletedAt?: Date | null;
    feedbackCount?: number;
    feedbacks?: Feedback[];
  }) {
    this.id = props.id;
    this.title = props.title;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
    this.deletedAt = props.deletedAt;
    this.feedbackCount = props.feedbackCount;
    this.feedbacks = props.feedbacks;
  }
}
