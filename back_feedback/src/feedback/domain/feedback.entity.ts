export class Feedback {
  readonly id: number;
  readonly message: string;
  readonly projectId: string;
  readonly createdAt: Date;
  readonly deletedAt?: Date | null;

  constructor(props: {
    id: number;
    message: string;
    projectId: string;
    createdAt: Date;
    deletedAt?: Date | null;
  }) {
    this.id = props.id;
    this.message = props.message;
    this.projectId = props.projectId;
    this.createdAt = props.createdAt;
    this.deletedAt = props.deletedAt;
  }
}
