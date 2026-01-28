import { useState } from "react";
import css from "./AddReading.module.css";
import { startReading, stopReading, type Book } from "../../api/reading";
import * as yup from "yup";
import { toast } from "react-toastify";

export type ReadingProps = {
  book: Book | null;
  isReading: boolean;
  onBookUpdate: (book: Book) => void;
};

export function AddReading({ book, isReading, onBookUpdate }: ReadingProps) {
  const [page, setPage] = useState("");
  const [loading, setLoading] = useState(false);

  const active = book?.progress.find((p) => p.status === "active");
  const minStopPage = isReading ? active?.startPage : undefined;

  const schema = yup.object({
    page: yup
      .number()
      .typeError("Page must be a number")
      .integer("Page must be an integer")
      .required("Page is required")
      .min(
        minStopPage ?? 1,
        minStopPage
          ? `Stop page can't be less than ${minStopPage}`
          : "Page must be at least 1",
      )
      .max(book?.totalPages ?? 1, `Page must be ≤ ${book?.totalPages ?? 1}`),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const validated = await schema.validate(
        { page: Number(page) },
        { abortEarly: true },
      );
      const pageNum = validated.page;

      if (!book?._id) {
        throw new Error("Book ID is missing");
      }
      const updatedBook = !isReading
        ? await startReading({ id: book._id, page: pageNum })
        : await stopReading({ id: book._id, page: pageNum });

      onBookUpdate(updatedBook);
      setPage("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
      return;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={css.container}>
      <div className={css.window}>
        <span className={css.span}>Start reading:</span>
        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.field}>
            <label htmlFor="pages" className={css.label}>
              Number of pages:
            </label>
            <input
              id="pages"
              type="text"
              className={`${css.input} ${css.inputPages}`}
              value={page}
              onChange={(e) => setPage(e.target.value)}
              disabled={loading}
            />
          </div>
          <button className={css.button} type="submit">
            {isReading ? "To stop" : "To start"}
          </button>
        </form>
      </div>
      <div className={css.window}></div>
    </div>
  );
}
