export class CreateBookDetailInput {
  bookDetailCode: string;
  bookId: number;
  publisherId: number;
  authorId: number;
  language: string;
  pages: number;
  quantity: number;
  price: number;
  description?: string;
}
