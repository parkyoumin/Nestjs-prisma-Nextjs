export class Project {
  readonly id: string;
  readonly title: string;
  readonly userId: bigint;
  readonly createdAt: Date;
  readonly deletedAt?: Date | null;
  readonly feedbackCount?: number;

  constructor(props: {
    id: string;
    title: string;
    userId: bigint;
    createdAt: Date;
    deletedAt?: Date | null;
    feedbackCount?: number;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
    this.deletedAt = props.deletedAt;
    this.feedbackCount = props.feedbackCount;
  }
}
